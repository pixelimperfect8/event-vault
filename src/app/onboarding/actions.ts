'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { redirect } from "next/navigation"

export async function completeOnboarding(data: {
    plans: string[]
    storage: string[]
    workspaceName: string
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const updatedUser = await db.user.update({
        where: { email: session.user.email },
        data: {
            hasCompletedOnboarding: true,
            workspaceName: data.workspaceName,
            // We could store the other preferences in a 'settings' JSON column later if we wanted
        }
    })

    if (!updatedUser) {
        throw new Error("Failed to update user")
    }

    redirect("/dashboard")
}
