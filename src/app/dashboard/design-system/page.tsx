import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db-client"
import { redirect } from "next/navigation"
import { Box } from "lucide-react"
import { DesignSystemClient } from "./design-system-client"

export default async function DesignSystemPage() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect("/login")
    }

    const user = await db.user.findUnique({ where: { email: session.user.email! } })
    if (!user || user.role !== 'APP_MASTER') {
        redirect("/dashboard")
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 bg-slate-50/30 min-h-screen">
            {/* Premium Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-indigo-600">
                    <Box className="h-6 w-6" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">App Master Resources</span>
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">Design System</h1>
                        <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
                            The visual foundation of EventVault. A curated collection of tokens, components, and patterns that power our premium experience.
                        </p>
                    </div>
                    <div className="hidden lg:block text-right">
                        <p className="text-3xl font-black text-slate-900">v1.0.0</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Version</p>
                    </div>
                </div>
            </div>

            <DesignSystemClient />
        </div>
    )
}
