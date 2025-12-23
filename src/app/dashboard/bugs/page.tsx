import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui-components"
import { Bug, Clock, User, Hash, CheckCircle2 } from "lucide-react"
import { BugListClient } from "./bug-list-client"

export default async function BugsPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await db.user.findUnique({ where: { email: session.user.email! } })
    if (!user || user.role !== 'APP_MASTER') {
        redirect("/dashboard")
    }

    const bugs = await db.bug.findMany({ where: {} })

    // Sort bugs by newest first
    const sortedBugs = [...bugs].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Bug className="h-8 w-8 text-red-600" />
                        Bug Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1">Track and manage UI fixes reported via the App Master tool.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">{sortedBugs.filter((b: any) => b.status === 'PENDING').length} Pending</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Queue</p>
                    </div>
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-xs font-bold border border-red-100 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        MASTER CONTROL
                    </div>
                </div>
            </div>

            {sortedBugs.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bug className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No bugs reported yet</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                        Any bugs you report using the capture tool will appear here for processing by the AI Auto-fixer.
                    </p>
                </div>
            ) : (
                <BugListClient bugs={sortedBugs} />
            )}
        </div>
    )
}
