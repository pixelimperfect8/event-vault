"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui-components"
import { Check, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { completeOnboarding } from "./actions"

const PLAN_TYPES = [
    "Weddings", "Corporate Events", "Social Gatherings", "Conferences", "Non-Profit", "Other"
]

const STORAGE_METHODS = [
    "Google Drive", "Dropbox", "Email Attachments", "Physical Binders", "Desktop Folders", "Other"
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedPlans, setSelectedPlans] = useState<string[]>([])
    const [selectedStorage, setSelectedStorage] = useState<string[]>([])
    const [workspaceName, setWorkspaceName] = useState("")

    const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item))
        } else {
            setList([...list, item])
        }
    }

    const handleNext = async () => {
        if (step < 3) setStep(step + 1)
        else {
            // Server action handles redirect, which throws an error we shouldn't catch
            await completeOnboarding({
                plans: selectedPlans,
                storage: selectedStorage,
                workspaceName
            })
        }
    }

    const isStepValid = () => {
        if (step === 1) return selectedPlans.length > 0
        if (step === 2) return selectedStorage.length > 0
        if (step === 3) return workspaceName.length > 2
        return false
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-lg shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-500">Step {step} of 3</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={cn("h-2 w-8 rounded-full transition-colors", i <= step ? "bg-slate-900" : "bg-slate-200")} />
                            ))}
                        </div>
                    </div>
                    <CardTitle className="text-2xl">
                        {step === 1 && "What type of events do you plan?"}
                        {step === 2 && "How do you store contracts today?"}
                        {step === 3 && "Name your workspace"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Select all that apply. This helps us customize templates."}
                        {step === 2 && "We'll help you migrate or link to your existing files."}
                        {step === 3 && "This will be your home base for all events."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-3">
                            {PLAN_TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleSelection(type, selectedPlans, setSelectedPlans)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border text-sm font-medium transition-all hover:border-slate-400",
                                        selectedPlans.includes(type)
                                            ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                            : "border-slate-200 bg-white"
                                    )}
                                >
                                    {type}
                                    {selectedPlans.includes(type) && <Check className="h-4 w-4 text-slate-900" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-3">
                            {STORAGE_METHODS.map(method => (
                                <button
                                    key={method}
                                    onClick={() => toggleSelection(method, selectedStorage, setSelectedStorage)}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg border text-sm font-medium transition-all hover:border-slate-400",
                                        selectedStorage.includes(method)
                                            ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                                            : "border-slate-200 bg-white"
                                    )}
                                >
                                    {method}
                                    {selectedStorage.includes(method) && <Check className="h-4 w-4 text-slate-900" />}
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Workspace Name</label>
                                <Input
                                    placeholder="e.g. Acme Events HQ"
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={handleNext}
                            className="w-full sm:w-auto"
                            disabled={!isStepValid()}
                        >
                            {step === 3 ? "Complete Setup" : "Next Step"}
                            {step !== 3 && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
