"use client"

import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui-components"
import { FileText, Upload, MoreVertical, Calendar as CalendarIcon, MapPin, User, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Event, Contract } from "@/lib/types"

interface EventClientViewProps {
    event: Event
    contracts: Contract[]
}

export function EventClientView({ event, contracts }: EventClientViewProps) {
    const [activeTab, setActiveTab] = useState("contracts")

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">{event.name}</h1>
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            {event.clientName && (
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {event.clientName}
                                </div>
                            )}
                            {event.startDate && (
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    {event.startDate}
                                </div>
                            )}
                            {event.venueName && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {event.venueName}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Edit Event</Button>
                        <Button>Share</Button>
                    </div>
                </div>

                <div className="flex items-center gap-6 mt-8 border-b border-slate-100 -mb-6 scrollbar-hide overflow-x-auto whitespace-nowrap">
                    {["Overview", "Contracts", "Activity"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={cn(
                                "pb-4 text-sm font-medium border-b-2 transition-colors",
                                activeTab === tab.toLowerCase()
                                    ? "border-slate-900 text-slate-900"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-8 max-w-6xl">

                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">Total Contracts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{contracts.length}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">Tasks Completed</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">
                                        {event.sections?.reduce((acc: number, s: { tasks: { completed: boolean }[] }) => acc + s.tasks.filter(t => t.completed).length, 0) || 0}
                                        <span className="text-sm text-slate-400 font-normal ml-2">
                                            / {event.sections?.reduce((acc: number, s: { tasks: { completed: boolean }[] }) => acc + s.tasks.length, 0) || 0}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {event.sections?.map((section: { title: string, tasks: { title: string, completed: boolean }[] }, idx: number) => (
                                <Card key={idx}>
                                    <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/30">
                                        <CardTitle className="text-base font-semibold text-slate-900">{section.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 px-0">
                                        <div className="space-y-1">
                                            {(section.tasks as { title: string, completed: boolean }[]).map((task, tIdx: number) => (
                                                <div key={tIdx} className="flex items-center gap-3 px-6 py-2 hover:bg-slate-50/80 transition-colors group">
                                                    <div className={cn(
                                                        "h-4 w-4 rounded-md border flex items-center justify-center transition-colors",
                                                        task.completed ? "bg-indigo-600 border-indigo-600" : "border-slate-300 group-hover:border-indigo-400"
                                                    )}>
                                                        {task.completed && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <span className={cn(
                                                        "text-sm",
                                                        task.completed ? "text-slate-400 line-through" : "text-slate-700"
                                                    )}>
                                                        {task.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {(!event.sections || event.sections.length === 0) && (
                                <Card className="p-12 text-center text-slate-500 col-span-2 border-dashed">
                                    No tasks set up yet. Try adding a section.
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "contracts" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Contracts & Files</h2>
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Contract
                            </Button>
                        </div>

                        {contracts.length === 0 ? (
                            <Card className="p-8 text-center text-slate-500">
                                No contracts uploaded yet.
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {contracts.map(contract => (
                                    <Card key={contract.id} className="overflow-hidden">
                                        <div className="p-6 flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                                    <FileText className="h-6 w-6 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{contract.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-xs font-medium",
                                                            contract.status === "SIGNED" ? "bg-green-100 text-green-700" :
                                                                contract.status === "DRAFT" ? "bg-amber-100 text-amber-700" :
                                                                    "bg-slate-100 text-slate-700"
                                                        )}>
                                                            {contract.status}
                                                        </span>
                                                        {contract.versions.length > 0 && (
                                                            <>
                                                                <span className="text-xs text-slate-400">• v{contract.versions[0].version}</span>
                                                                <span className="text-xs text-slate-400">• Updated {contract.versions[0].date}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4 text-slate-400" />
                                            </Button>
                                        </div>
                                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                                            <div className="text-xs text-slate-500">
                                                {contract.versions.length > 0 ? `Latest file: ${contract.versions[0].file}` : "No file uploaded"}
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-auto py-1 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                View Analysis
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "activity" && (
                    <div className="max-w-xl">
                        <h2 className="text-lg font-semibold mb-6">Activity Log</h2>
                        <div className="text-slate-500 text-sm">No recent activity</div>
                    </div>
                )}

            </div>
        </div>
    )
}
