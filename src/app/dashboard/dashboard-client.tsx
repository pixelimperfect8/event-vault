'use client'

import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui-components"
import { PlusCircle, FileText, CalendarDays } from "lucide-react"
import { EventWizard } from "@/components/events/EventWizard"
import { Event } from "@/lib/types"
import { cn } from "@/lib/utils"

interface DashboardClientProps {
    events: Event[]
    stats: {
        totalContracts: number
        pendingContracts: number
    }
}

export function DashboardClient({ events, stats }: DashboardClientProps) {
    const [showWizard, setShowWizard] = useState(false)

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <Button onClick={() => setShowWizard(true)} className="w-full md:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Event
                </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <CalendarDays className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{events.length}</div>
                        <p className="text-xs text-slate-500">All time</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                        <FileText className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalContracts}</div>
                        <p className="text-xs text-slate-500">{stats.pendingContracts} pending signature</p>
                    </CardContent>
                </Card>
            </div>

            {events.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 p-12 text-center">
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">No recent activity</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating a new event or uploading a contract.</p>
                    <div className="mt-6">
                        <Button variant="outline" onClick={() => setShowWizard(true)}>Create Event</Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {events.map(evt => (
                        <Card key={evt.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">{evt.name}</CardTitle>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                        evt.status === 'PLANNING' ? "bg-blue-100 text-blue-700" :
                                            evt.status === 'ACTIVE' ? "bg-green-100 text-green-700" :
                                                evt.status === 'DRAFT' ? "bg-slate-100 text-slate-600" :
                                                    "bg-slate-100 text-slate-700"
                                    )}>
                                        {evt.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">{evt.clientName || 'No Client'}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-slate-600">
                                    {evt.venueName && <div className="flex items-center gap-1 mb-1"><span className="text-slate-400">@</span> {evt.venueName}</div>}
                                    {evt.startDate && <div className="flex items-center gap-1"><span className="text-slate-400">On</span> {evt.startDate}</div>}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {showWizard && <EventWizard onClose={() => setShowWizard(false)} />}
        </div>
    )
}
