
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { redirect } from "next/navigation"
import { EventClientView } from "@/app/dashboard/events/[id]/client-view" // Split Client/Server

interface PageProps {
    params: { id: string }
}

export default async function EventPage({ params }: PageProps) {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) redirect("/login")

    const event = await db.event.findUnique({ where: { id: params.id } })

    if (!event) {
        return <div className="p-8">Event not found</div>
    }

    // Check ownership (simple check)
    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user || event.userId !== user.id) {
        return <div className="p-8">Access denied</div>
    }

    const contracts = await db.contract.findMany({
        where: { eventId: event.id },
        // include: { versions: true },
        // orderBy: { createdAt: 'desc' }
    })
    return <EventClientView
        event={{ ...JSON.parse(JSON.stringify(event)), role: "OWNER" }}
        contracts={contracts}
    />
}
