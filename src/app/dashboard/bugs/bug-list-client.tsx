"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, Button } from "@/components/ui-components"
import { Bug, Clock, User, Hash, CheckCircle2, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { resolveBug } from "./actions"

interface BugListClientProps {
    bugs: any[]
}

export function BugListClient({ bugs: initialBugs }: BugListClientProps) {
    const [bugs, setBugs] = useState(initialBugs)
    const [resolving, setResolving] = useState<string | null>(null)
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'FIXED'>('ALL')

    const filteredBugs = bugs.filter(bug =>
        filter === 'ALL' || bug.status === filter
    )

    const handleResolve = async (id: string) => {
        setResolving(id)
        try {
            await resolveBug(id)
            setBugs(prev => prev.map(b => b.id === id ? { ...b, status: 'FIXED' } : b))
        } catch (err) {
            console.error(err)
            alert("Failed to resolve bug")
        } finally {
            setResolving(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm">
                {(['ALL', 'PENDING', 'FIXED'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                            filter === f
                                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredBugs.map((bug: any) => (
                    <Card
                        key={bug.id}
                        className={cn(
                            "overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 group relative",
                            bug.status === 'FIXED' && "opacity-75 grayscale-[0.5]"
                        )}
                    >
                        <CardHeader className={cn(
                            "bg-slate-50/50 border-b border-slate-100 py-4 px-6 flex flex-row items-center justify-between",
                            bug.status === 'FIXED' && "bg-green-50/30"
                        )}>
                            <div className="flex items-center gap-2">
                                <div className={cn(
                                    "h-2 w-2 rounded-full",
                                    bug.status === 'PENDING' ? "bg-orange-500 animate-pulse" : "bg-green-500"
                                )} />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {bug.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 group-hover:text-slate-600 transition-colors">
                                <Hash className="h-3 w-3" />
                                {bug.id.slice(0, 8)}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <h4 className={cn(
                                        "text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors",
                                        bug.status === 'FIXED' && "line-through decoration-slate-300"
                                    )}>
                                        {bug.description || "No description provided"}
                                    </h4>
                                    {bug.status === 'PENDING' && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-110 active:scale-95 flex-shrink-0"
                                            onClick={() => handleResolve(bug.id)}
                                            disabled={resolving === bug.id}
                                            title="Mark as Fixed"
                                        >
                                            {resolving === bug.id ? (
                                                <div className="h-4 w-4 border-2 border-indigo-600 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    )}
                                </div>

                                <div className="bg-slate-900/90 text-[10px] font-mono text-slate-300 p-2.5 rounded-xl flex items-center justify-between group/selector transition-all hover:bg-slate-900 shadow-inner">
                                    <span className="truncate max-w-[180px]">{bug.element_selector}</span>
                                    <ChevronRight className="h-3 w-3 opacity-0 group-hover/selector:opacity-50 transition-all -translate-x-1 group-hover/selector:translate-x-0" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                    <span className="font-medium">
                                        {new Date(bug.created_at).toLocaleDateString()} at {new Date(bug.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                    </div>
                                    <span className="font-medium">Reporter: App Master</span>
                                </div>
                            </div>

                            {bug.element_text && (
                                <div className="mt-4 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-3.5 group-hover:bg-indigo-50 transition-colors relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Bug className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1 tracking-wider">Element Context</p>
                                    <p className="text-xs text-indigo-900 italic font-semibold truncate leading-relaxed">
                                        "{bug.element_text}"
                                    </p>
                                </div>
                            )}
                        </CardContent>

                        {bug.status === 'FIXED' && (
                            <div className="absolute inset-0 bg-green-50/5 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/80 backdrop-blur-sm border border-green-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm transform -rotate-3 translate-y-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <span className="text-xs font-bold text-green-700">RESOLVED</span>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    )
}
