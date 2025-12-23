import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { Sidebar } from "@/components/sidebar"
import { redirect } from "next/navigation"
import { BugCaptureTool } from "@/components/app-master/BugCaptureTool"
import { MobileHeader } from "@/components/mobile-header"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
        redirect("/login")
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email! }
    })

    if (!user) {
        redirect("/login")
    }

    if (!user.hasCompletedOnboarding) {
        redirect("/onboarding")
    }

    const events = await db.event.findMany({ where: { userId: user.id } })
    const isAppMaster = user.role === 'APP_MASTER'

    let pendingBugCount = 0
    if (isAppMaster) {
        const bugs = await db.bug.findMany({ where: {} })
        pendingBugCount = bugs.filter((b: any) => b.status === 'PENDING').length
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar events={events} user={user} pendingBugCount={pendingBugCount} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <MobileHeader user={user} events={events} pendingBugCount={pendingBugCount} />

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {isAppMaster && <BugCaptureTool />}
        </div>
    )
}
