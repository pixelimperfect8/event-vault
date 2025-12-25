"use client"

import { useState } from "react"
import { Event, Contract } from "@/lib/types"
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-components"
import { Calendar, MapPin, Clock, Users, ArrowRight, FileText } from "lucide-react"
import Link from "next/link"
import { ContractsTab } from "@/components/events/ContractsTab"

interface EventClientViewProps {
    event: Event
    contracts: Contract[]
}

export function EventClientView({ event, contracts }: EventClientViewProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'budget' | 'timeline'>('overview')

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{event.name}</h1>
                    <div className="flex items-center gap-2 mt-2 text-slate-500">
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
                            {event.status}
                        </span>
                        <span className="text-sm">•</span>
                        <span className="text-sm">{event.type}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline">Edit Event</Button>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                        Open Planner
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {[
                        { id: 'overview', name: 'Overview' },
                        { id: 'contracts', name: 'Contracts', count: contracts.length },
                        { id: 'budget', name: 'Budget' },
                        { id: 'timeline', name: 'Timeline' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                                ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                            `}
                        >
                            {tab.name}
                            {tab.count !== undefined && (
                                <span className={`
                                    ml-1 rounded-full py-0.5 px-2 text-xs font-bold
                                    ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}
                                `}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Date & Time</CardTitle>
                                <Calendar className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date TBD'}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {event.startTime || 'Time TBD'}
                                    {event.endTime && ` - ${event.endTime}`}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Venue</CardTitle>
                                <MapPin className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    {event.venueName || 'Venue TBD'}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {event.venueAddress || 'Address not set'}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Guest Count</CardTitle>
                                <Users className="h-4 w-4 text-slate-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">
                                    Est. 150
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Standard Capacity
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'contracts' && (
                    <ContractsTab eventId={event.id} contracts={contracts} />
                )}

                {activeTab === 'budget' && (
                    <div className="text-center py-12 text-slate-400">Budget planner coming soon...</div>
                )}

                {activeTab === 'timeline' && (
                    <div className="text-center py-12 text-slate-400">Timeline view coming soon...</div>
                )}
            </div>
        </div>
    )
}
