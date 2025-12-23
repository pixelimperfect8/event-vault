'use client'

import { useState } from "react"
import { Menu, X, Plus, Calendar, LayoutDashboard, LogOut, Settings, Bug } from "lucide-react"
import { Button } from "@/components/ui-components"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import { EventWizard } from "./events/EventWizard"

interface MobileHeaderProps {
    user: any
    events: any[]
    pendingBugCount?: number
}

export function MobileHeader({ user, events, pendingBugCount = 0 }: MobileHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [showWizard, setShowWizard] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Settings', href: '#', icon: Settings },
    ]

    return (
        <>
            <header className="md:hidden h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg tracking-tight text-slate-900">EventVault</span>
                </div>
                <div className="flex items-center gap-2">
                    {user.role === 'APP_MASTER' && pendingBugCount > 0 && (
                        <div className="h-5 w-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                            {pendingBugCount}
                        </div>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                        <Menu className="h-6 w-6 text-slate-600" />
                    </Button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <span className="font-bold text-slate-900">Menu</span>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            <nav className="space-y-1">
                                {navItems.map(item => (
                                    <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className={cn("w-full justify-start h-12 text-base", pathname === item.href && "bg-slate-100 font-semibold")}
                                        >
                                            <item.icon className="mr-3 h-5 w-5 opacity-70" />
                                            {item.label}
                                        </Button>
                                    </Link>
                                ))}

                                {user.role === 'APP_MASTER' && (
                                    <Link href="/dashboard/bugs" onClick={() => setIsOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className={cn("w-full justify-start h-12 text-base text-red-600", pathname === "/dashboard/bugs" && "bg-red-50 font-semibold")}
                                        >
                                            <Bug className="mr-3 h-5 w-5 opacity-70" />
                                            Bugs Dashboard
                                            {pendingBugCount > 0 && (
                                                <span className="ml-auto bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                                                    {pendingBugCount}
                                                </span>
                                            )}
                                        </Button>
                                    </Link>
                                )}

                                {user.role === 'APP_MASTER' && (
                                    <Link href="/dashboard/design-system" onClick={() => setIsOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className={cn("w-full justify-start h-12 text-base text-indigo-600", pathname === "/dashboard/design-system" && "bg-indigo-50 font-semibold")}
                                        >
                                            <LayoutDashboard className="mr-3 h-5 w-5 opacity-70" />
                                            Design System
                                        </Button>
                                    </Link>
                                )}
                            </nav>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Events</h3>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            setIsOpen(false)
                                            setShowWizard(true)
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {events.length === 0 ? (
                                        <p className="px-2 text-sm text-slate-400">No events yet.</p>
                                    ) : (
                                        events.map(evt => (
                                            <Link key={evt.id} href={`/dashboard/events/${evt.id}`} onClick={() => setIsOpen(false)}>
                                                <Button
                                                    variant="ghost"
                                                    className={cn("w-full justify-start h-11 font-normal truncate text-sm", pathname.includes(evt.id) && "bg-indigo-50 text-indigo-700 font-medium")}
                                                >
                                                    <Calendar className="mr-3 h-4 w-4 opacity-60" />
                                                    {evt.name}
                                                </Button>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t bg-slate-50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                        {user.name?.[0].toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{user.name || 'User'}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 h-11"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {showWizard && <EventWizard onClose={() => setShowWizard(false)} />}
        </>
    )
}
