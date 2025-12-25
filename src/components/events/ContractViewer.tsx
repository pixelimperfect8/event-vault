"use client"

import { useState } from "react"
import { Contract } from "@/lib/types"
import { Button } from "@/components/ui-components"
import { X, Sparkles, AlertTriangle, Calendar, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIInsightsPanelProps {
    analysis: any // JSON from Gemini
    isLoading: boolean
}

export function AIInsightsPanel({ analysis, isLoading }: AIInsightsPanelProps) {
    if (isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 bg-slate-50 border-r border-slate-200">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="font-semibold text-slate-900">Gemini is analyzing...</h3>
                    <p className="text-sm text-slate-500">Extracting dates, costs, and risks.</p>
                </div>
            </div>
        )
    }

    if (!analysis) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 border-r border-slate-200 text-center">
                <p className="text-sm text-slate-500">No analysis available.</p>
            </div>
        )
    }

    const { summary, important_dates, costs, risks } = analysis

    return (
        <div className="h-full overflow-y-auto bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="flex items-center gap-2 font-bold text-slate-900">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    AI Insights
                </h3>
            </div>

            <div className="p-4 space-y-6">
                {/* Summary */}
                <section className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Overview</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
                </section>

                {/* Risks */}
                {risks && risks.length > 0 && (
                    <section className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Potential Risks
                        </h4>
                        <ul className="space-y-2">
                            {risks.map((risk: string, i: number) => (
                                <li key={i} className="text-xs bg-red-50 text-red-700 p-2 rounded-lg border border-red-100">
                                    {risk}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Important Dates */}
                {important_dates && important_dates.length > 0 && (
                    <section className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Dates</h4>
                        <ul className="space-y-2">
                            {important_dates.map((item: any, i: number) => (
                                <li key={i} className="text-sm flex justify-between items-start border-b border-slate-50 pb-2 last:border-0">
                                    <span className="text-slate-700">{item.event}</span>
                                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.date}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Costs */}
                {costs && costs.length > 0 && (
                    <section className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Financials</h4>
                        <ul className="space-y-2">
                            {costs.map((item: any, i: number) => (
                                <li key={i} className="text-sm flex justify-between items-start bg-emerald-50/50 p-2 rounded-lg">
                                    <span className="text-slate-700">{item.description}</span>
                                    <span className="font-mono text-xs font-bold text-emerald-700">{item.amount}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    )
}

interface ContractViewerProps {
    contract: Contract
    onClose: () => void
}

import { getContractAnalysis } from "@/app/dashboard/events/contract-actions"
import { useEffect } from "react"

export function ContractViewer({ contract, onClose }: ContractViewerProps) {
    const fileUrl = contract.versions[contract.versions.length - 1]?.filePath;
    const [analysis, setAnalysis] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        async function loadAnalysis() {
            if (!fileUrl) {
                if (mounted) setLoading(false)
                return
            }
            try {
                // Poll for analysis if it's missing (it might be processing)
                // For now, just one fetch
                const data = await getContractAnalysis(fileUrl)
                if (mounted && data) {
                    setAnalysis(data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        loadAnalysis()
        return () => { mounted = false }
    }, [fileUrl])

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full h-full max-w-7xl max-h-[90vh] flex overflow-hidden shadow-2xl relative">
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 z-10 hover:bg-slate-100 rounded-full"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                {/* Left Panel: AI Analysis (1/3) */}
                <div className="w-1/3 min-w-[320px] h-full flex flex-col">
                    <AIInsightsPanel analysis={analysis} isLoading={loading && !analysis} />
                </div>

                {/* Right Panel: PDF Viewer (2/3) */}
                <div className="flex-1 bg-slate-100 h-full relative">
                    {fileUrl && fileUrl.toLowerCase().endsWith('.pdf') ? (
                        <iframe src={fileUrl} className="w-full h-full" title="Contract PDF" />
                    ) : fileUrl ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                            <FileText className="h-16 w-16 text-slate-300" />
                            <p>Preview not available for this file type.</p>
                            <a href={fileUrl} download className="flex items-center gap-2 text-indigo-600 hover:underline">
                                <Download className="h-4 w-4" />
                                Download to view
                            </a>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            No file preview available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
