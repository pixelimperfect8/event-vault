"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, Plus, Search, LogOut, Bug } from "lucide-react"
import { Button, Input } from "@/components/ui-components"
import { Event } from "@/lib/types"
import { useState } from "react"
import { EventWizard } from "./events/EventWizard"

interface SidebarProps {
    events: Event[]
    user: {
        name?: string | null
        email?: string | null
        role?: string | null
    }
    pendingBugCount?: number
}

export function Sidebar({ events, user, pendingBugCount = 0 }: SidebarProps) {
    const pathname = usePathname()
    const [showWizard, setShowWizard] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredEvents = events.filter(evt =>
        evt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <>
            <aside className="w-64 border-r border-slate-200 bg-white flex flex-col h-full shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                <div className="p-4 h-16 flex items-center border-b border-slate-100 px-6">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 shadow-md shadow-indigo-200">
                        <span className="text-white font-bold text-lg">E</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight text-slate-900">EventVault</span>
                </div>

                <div className="p-4 px-6">
                    <div className="relative group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-2 px-4 space-y-8">
                    <div>
                        <h3 className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Navigate
                        </h3>
                        <nav className="space-y-1">
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start h-10 px-3 rounded-xl transition-all",
                                        pathname === "/dashboard" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                    )}
                                    size="sm"
                                >
                                    <LayoutDashboard className={cn("mr-3 h-4 w-4", pathname === "/dashboard" ? "text-indigo-600" : "text-slate-400")} />
                                    Dashboard
                                </Button>
                            </Link>

                            {user.role === 'APP_MASTER' && (
                                <Link href="/dashboard/bugs">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start h-10 px-3 rounded-xl transition-all",
                                            pathname === "/dashboard/bugs" ? "bg-red-50 text-red-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                        )}
                                        size="sm"
                                    >
                                        <Bug className={cn("mr-3 h-4 w-4", pathname === "/dashboard/bugs" ? "text-red-600" : "text-slate-400")} />
                                        Bugs
                                        {pendingBugCount > 0 ? (
                                            <span className="ml-auto bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-lg shadow-red-200 animate-in zoom-in duration-300">
                                                {pendingBugCount}
                                            </span>
                                        ) : (
                                            <span className="ml-auto bg-red-100 text-red-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full">MASTER</span>
                                        )}
                                    </Button>
                                </Link>
                            )}

                            {user.role === 'APP_MASTER' && (
                                <Link href="/dashboard/design-system">
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start h-10 px-3 rounded-xl transition-all",
                                            pathname === "/dashboard/design-system" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                                        )}
                                        size="sm"
                                    >
                                        <LayoutDashboard className={cn("mr-3 h-4 w-4", pathname === "/dashboard/design-system" ? "text-indigo-600" : "text-slate-400")} />
                                        Design System
                                    </Button>
                                </Link>
                            )}

                            <Button variant="ghost" className="w-full justify-start h-10 px-3 rounded-xl text-slate-600 hover:bg-slate-50" size="sm">
                                <Settings className="mr-3 h-4 w-4 text-slate-400" />
                                Settings
                            </Button>
                        </nav>
                    </div>

                    <div>
                        <div className="flex items-center justify-between px-2 mb-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                {searchQuery ? 'Search Results' : 'Recent Events'}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                                onClick={() => setShowWizard(true)}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>

                        {filteredEvents.length === 0 ? (
                            <div className="px-2 py-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-[10px] font-medium text-slate-400">No events found</p>
                            </div>
                        ) : (
                            <nav className="space-y-1">
                                {filteredEvents.map(evt => (
                                    <Link key={evt.id} href={`/dashboard/events/${evt.id}`}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start h-10 px-3 font-normal rounded-xl transition-all group",
                                                pathname === `/dashboard/events/${evt.id}` ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm" : "text-slate-600 hover:bg-slate-50"
                                            )}
                                            size="sm"
                                        >
                                            <div className={cn(
                                                "mr-3 h-2 w-2 rounded-full",
                                                evt.status === 'ACTIVE' ? "bg-green-500" : "bg-slate-300 group-hover:bg-indigo-400 transition-colors"
                                            )} />
                                            <span className="truncate">{evt.name}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>
                </div>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-100">
                                    {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                                </div>
                                <div className="text-sm overflow-hidden">
                                    <p className="font-bold text-slate-900 truncate max-w-[80px] leading-tight">{user.name || "User"}</p>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                                        {user.role === 'APP_MASTER' ? 'App Master' : 'Workspace'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                title="Log out"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>

            {showWizard && <EventWizard onClose={() => setShowWizard(false)} />}
        </>
    )
}
