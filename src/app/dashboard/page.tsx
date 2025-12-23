import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { redirect } from "next/navigation"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) redirect("/login")

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    if (!user) redirect("/login")

    const events = await db.event.findMany({ where: { userId: user.id } })

    // Calculate stats
    let totalContracts = 0
    let pendingContracts = 0

    for (const evt of events) {
        const contracts = await db.contract.findMany({ where: { eventId: evt.id } })
        totalContracts += contracts.length
        pendingContracts += contracts.filter(c => c.status !== 'SIGNED').length
    }

    return (
        <DashboardClient
            events={events}
            stats={{ totalContracts, pendingContracts }}
        />
    )
}
