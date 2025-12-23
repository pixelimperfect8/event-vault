'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { EVENT_TEMPLATES } from "@/lib/templates"

export async function createEvent(data: any) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("Unauthorized")

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user) throw new Error("User not found")

    // Find and apply template if templateId is provided
    let sections = []
    if (data.templateId) {
        const template = EVENT_TEMPLATES.find(t => t.id === data.templateId)
        if (template) {
            sections = template.sections
        }
    }

    const event = await db.event.create({
        data: {
            ...data,
            userId: user.id,
            status: 'PLANNING',
            sections: sections
        }
    })

    revalidatePath("/dashboard")
    redirect(`/dashboard/events/${event.id}`)
}

export async function saveEventDraft(data: any) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("Unauthorized")

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user) throw new Error("User not found")

    const event = await db.event.create({
        data: {
            ...data,
            userId: user.id,
            status: 'DRAFT'
        }
    })

    revalidatePath("/dashboard")
    return event
}
