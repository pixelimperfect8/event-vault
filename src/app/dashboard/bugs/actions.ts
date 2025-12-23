'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { revalidatePath } from "next/cache"

export async function logBug(data: {
    elementSelector: string;
    elementText: string;
    description: string;
}) {
    const session = await getServerSession(authOptions)
    console.log("[DEBUG] logBug session:", !!session, "User:", session?.user?.email)

    if (!session?.user || session.user.role !== 'APP_MASTER') {
        throw new Error("Unauthorized: Only App Masters can log bugs")
    }

    const userId = session.user.id

    // Log to DB
    const bug = await db.bug.create({
        data: {
            reporterId: userId,
            elementSelector: data.elementSelector,
            elementText: data.elementText,
            description: data.description
        }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/bugs")

    // In a real scenario, this would trigger an AI event
    console.log(`[AI-TRGGER] New bug logged: ${bug.id}. Initiating background fix...`)

    return bug
}

export async function resolveBug(bugId: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'APP_MASTER') {
        throw new Error("Unauthorized")
    }

    try {
        const updatedBug = await db.bug.update({
            where: { id: bugId },
            data: { status: 'FIXED' }
        })
        revalidatePath("/dashboard/bugs")
        console.log(`[AI-RESOLVE] Bug ${bugId} marked as FIXED.`)
        return updatedBug
    } catch (error) {
        console.error("Failed to resolve bug:", error)
        throw error
    }
}
