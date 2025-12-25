"use client"

import { useState } from "react"
import { Contract } from "@/lib/types"
import { Button, Input, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui-components"
import { FileText, Upload, Calendar, ArrowRight, Loader2, Sparkles, Eye } from "lucide-react"
import { uploadContract } from "@/app/dashboard/events/contract-actions"
import { cn } from "@/lib/utils"
import { ContractViewer } from "./ContractViewer"

interface ContractsTabProps {
    eventId: string
    contracts: Contract[]
}

export function ContractsTab({ eventId, contracts }: ContractsTabProps) {
    console.log("ContractsTab contracts:", contracts) // Debug log
    const [isUploading, setIsUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null)

    async function handleFile(file: File) {
        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        if (!file || !validTypes.includes(file.type)) {
            alert("Please upload a PDF, DOC, or DOCX file")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        formData.append("eventId", eventId)

        try {
            await uploadContract(formData)
        } catch (error) {
            console.error(error)
            alert("Failed to upload contract")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Contracts</h3>
                    <p className="text-sm text-slate-500">Manage and analyze your event contracts.</p>
                </div>
            </div>

            {/* Upload Area */}
            <div
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 transition-colors flex flex-col items-center justify-center text-center cursor-pointer",
                    dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:bg-slate-50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("contract-upload")?.click()}
            >
                <input
                    id="contract-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                    ) : (
                        <Upload className="h-6 w-6 text-indigo-600" />
                    )}
                </div>
                {isUploading ? (
                    <p className="text-sm font-medium text-slate-900">Uploading and Analyzing...</p>
                ) : (
                    <>
                        <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX files only (max 10MB)</p>
                    </>
                )}
            </div>

            {/* Contracts List */}
            <div className="grid gap-4">
                {contracts.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        No contracts uploaded yet.
                    </div>
                ) : (
                    contracts.map((contract) => (
                        <Card
                            key={contract.id}
                            className="group hover:shadow-md transition-all cursor-pointer border-slate-200"
                            onClick={() => setSelectedContract(contract)}
                        >
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                            {contract.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(contract.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View & Analyze
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Viewer Modal */}
            {selectedContract && (
                <ContractViewer
                    contract={selectedContract}
                    onClose={() => setSelectedContract(null)}
                />
            )}
        </div>
    )
}
