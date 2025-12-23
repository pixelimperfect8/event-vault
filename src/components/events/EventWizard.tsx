'use client'

import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, Label, Input, Select } from "@/components/ui-components"
import { ChevronRight, ChevronLeft, Check, Settings, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { createEvent, saveEventDraft } from "@/app/dashboard/events/actions"
import { EVENT_TEMPLATES } from "@/lib/templates"

interface EventWizardProps {
    onClose: () => void
}

export function EventWizard({ onClose }: EventWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        clientName: "",
        type: "Wedding",
        status: "PLANNING",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        venueName: "",
        venueAddress: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezone_offset: new Date().getTimezoneOffset(),
        templateId: "blank",
        vendors: [] as unknown[],
    })

    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, string> = {}
        if (currentStep === 1) {
            if (!formData.name.trim()) newErrors.name = "Event name is required"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 3))
        }
    }

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1))
    }

    const handleCreate = async () => {
        if (!validateStep(3)) return
        setLoading(true)
        try {
            await createEvent(formData)
        } catch (error) {
            console.error(error)
            setErrors({ submit: "Failed to create event" })
        } finally {
            setLoading(false)
        }
    }

    const handleSaveDraft = async () => {
        setLoading(true)
        try {
            await saveEventDraft(formData)
            onClose()
        } catch (error) {
            console.error(error)
            setErrors({ submit: "Failed to save draft" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 md:p-4">
            <Card className="w-full h-full md:h-auto md:max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 rounded-none md:rounded-2xl flex flex-col">
                <CardHeader className="border-b bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                        <CardTitle>Create New Event</CardTitle>
                        <Button variant="ghost" size="sm" onClick={onClose}>&times;</Button>
                    </div>
                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex-1 flex items-center gap-2">
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                    step >= i ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
                                )}>
                                    {step > i ? <Check className="h-4 w-4" /> : i}
                                </div>
                                {i < 3 && <div className={cn("flex-1 h-1 rounded-full", step > i ? "bg-slate-900" : "bg-slate-200")} />}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                        <span className={cn("text-xs font-medium", step === 1 ? "text-slate-900" : "text-slate-400")}>Basics</span>
                        <span className={cn("text-xs font-medium", step === 2 ? "text-slate-900" : "text-slate-400")}>Dates & Place</span>
                        <span className={cn("text-xs font-medium", step === 3 ? "text-slate-900" : "text-slate-400")}>Setup</span>
                    </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Event Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Smith & Jones Wedding"
                                    value={formData.name}
                                    onChange={e => updateField("name", e.target.value)}
                                    className={cn(errors.name && "border-red-500")}
                                />
                                {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client">Client / Organization</Label>
                                <Input
                                    id="client"
                                    placeholder="Who is this for?"
                                    value={formData.clientName}
                                    onChange={e => updateField("clientName", e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Event Type</Label>
                                    <Select
                                        id="type"
                                        value={formData.type}
                                        onChange={e => updateField("type", (e.target as HTMLSelectElement).value)}
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Corporate">Corporate</option>
                                        <option value="Social">Social</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Non-Profit">Non-Profit</option>
                                        <option value="Other">Other</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Initial Status</Label>
                                    <Select
                                        id="status"
                                        value={formData.status}
                                        onChange={e => updateField("status", (e.target as HTMLSelectElement).value)}
                                    >
                                        <option value="PLANNING">Planning</option>
                                        <option value="ACTIVE">Active / On-Site</option>
                                        <option value="COMPLETED">Completed</option>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={e => updateField("startDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Start Time (Optional)</Label>
                                    <Input
                                        id="startTime"
                                        type="time"
                                        value={formData.startTime}
                                        onChange={e => updateField("startTime", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={e => updateField("endDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time (Optional)</Label>
                                    <Input
                                        id="endTime"
                                        type="time"
                                        value={formData.endTime}
                                        onChange={e => updateField("endTime", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="venueName">Venue Name</Label>
                                <Input
                                    id="venueName"
                                    placeholder="The Grand Hotel"
                                    value={formData.venueName}
                                    onChange={e => updateField("venueName", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input
                                    id="timezone"
                                    value={formData.timezone}
                                    onChange={e => updateField("timezone", e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400">Auto-detected: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="template">Start from Template</Label>
                                <Select
                                    id="template"
                                    value={formData.templateId}
                                    onChange={e => updateField("templateId", (e.target as HTMLSelectElement).value)}
                                >
                                    {EVENT_TEMPLATES.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </Select>
                                <CardDescription>Templates seed your event with sections and tasks to get you started faster.</CardDescription>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold">Additional Setup (Coming Soon)</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none">
                                    <div className="p-3 bg-white border rounded border-dashed text-xs text-center text-slate-500">
                                        Upload Contracts
                                    </div>
                                    <div className="p-3 bg-white border rounded border-dashed text-xs text-center text-slate-500">
                                        Add Vendors
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                <div className="flex gap-3">
                                    <Settings className="h-5 w-5 text-indigo-600 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-indigo-900">Automation Enabled</h4>
                                        <p className="text-xs text-indigo-700 mt-1">
                                            We&apos;ll automatically set up your event dashboard and prepare your contract tracking table.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <div className="border-t p-6 flex items-center justify-between bg-slate-50/50">
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleSaveDraft} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Draft"}
                        </Button>
                    </div>
                    <div className="flex gap-3">
                        {step > 1 && (
                            <Button variant="outline" onClick={prevStep} disabled={loading}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button onClick={nextStep}>
                                Next Step
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleCreate} disabled={loading}>
                                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Complete Setup
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
