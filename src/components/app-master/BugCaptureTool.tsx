'use client'

import { useState, useEffect, useRef } from "react"
import { Button, Card, CardHeader, CardTitle, CardContent, Label, Textarea } from "@/components/ui-components"
import { Bug, X, MousePointer2, Crosshair, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { logBug } from "@/app/dashboard/bugs/actions"

export function BugCaptureTool() {
    const [isActive, setIsActive] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null)
    const [selectedElement, setSelectedElement] = useState<{ selector: string, text: string } | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const overlayRef = useRef<HTMLDivElement>(null)

    const toggleTool = () => {
        setIsActive(!isActive)
        setSelection(null)
        setSelectedElement(null)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isActive || showModal) return
        setIsSelecting(true)
        setSelection({
            startX: e.clientX,
            startY: e.clientY,
            endX: e.clientX,
            endY: e.clientY
        })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isSelecting || !selection) return
        setSelection(prev => prev ? ({
            ...prev,
            endX: e.clientX,
            endY: e.clientY
        }) : null)
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isSelecting || !selection) return
        setIsSelecting(false)

        // Find element under the end point (or center of selection)
        const midX = (selection.startX + selection.endX) / 2
        const midY = (selection.startY + selection.endY) / 2

        // Temporarily hide overlay to get element underneath
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'none'
        const el = document.elementFromPoint(midX, midY)
        if (overlayRef.current) overlayRef.current.style.pointerEvents = 'auto'

        if (el) {
            const selector = getSelector(el)
            const text = (el as HTMLElement).innerText?.slice(0, 100) || ""
            setSelectedElement({ selector, text })
            setShowModal(true)
        }
    }

    const getSelector = (el: Element): string => {
        if (el.id) return `#${el.id}`
        let selector = el.tagName.toLowerCase()
        if (el.className && typeof el.className === 'string') {
            selector += `.${el.className.split(' ').join('.')}`
        }
        return selector
    }

    const handleSubmit = async () => {
        if (!selectedElement) return
        setLoading(true)
        try {
            await logBug({
                elementSelector: selectedElement.selector,
                elementText: selectedElement.text,
                description
            })
            setSuccess(true)
            setError(null)
            setTimeout(() => {
                setShowModal(false)
                setIsActive(false)
                setSuccess(false)
                setSelection(null)
                setDescription("")
            }, 3000)
        } catch (err: any) {
            console.error("Bug Capture Tool Error:", err)
            // Handle Next.js server action error objects
            let message = "Failed to log bug. Please try again."
            if (typeof err === 'string') message = err
            else if (err.message) message = err.message
            else if (typeof err === 'object') {
                try {
                    message = err.message || JSON.stringify(err, (key, value) =>
                        typeof value === 'object' && value !== null ? value : value
                        , 2)
                    // If it's just a digest/anonymized error, try to be more descriptive
                    if (message.includes('digest')) {
                        message = "Server Error: The database might be out of sync. Please try refreshing or check the console."
                    }
                } catch {
                    message = "An unexpected error occurred"
                }
            }
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const selectionStyle: React.CSSProperties = selection ? {
        left: Math.min(selection.startX, selection.endX),
        top: Math.min(selection.startY, selection.endY),
        width: Math.abs(selection.endX - selection.startX),
        height: Math.abs(selection.endY - selection.startY),
    } : {}

    return (
        <>
            {/* Toggle Button */}
            <div className="fixed bottom-6 right-6 z-[60]">
                <Button
                    onClick={toggleTool}
                    className={cn(
                        "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
                        isActive ? "bg-red-600 hover:bg-red-700 text-white rotate-90" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    )}
                    size="icon"
                >
                    {isActive ? <X className="h-6 w-6" /> : <Bug className="h-6 w-6" />}
                </Button>
            </div>

            {/* Selection Overlay */}
            {isActive && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-[55] cursor-crosshair bg-slate-900/10"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-slate-200 flex items-center gap-2 animate-bounce">
                        <Crosshair className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-medium">Click and drag to select an element</span>
                    </div>

                    {selection && (
                        <div
                            className="absolute border-2 border-dashed border-red-500 bg-red-500/10 pointer-events-none"
                            style={selectionStyle}
                        />
                    )}
                </div>
            )}

            {/* Bug Report Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <Card className="w-full max-w-md shadow-2xl">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bug className="h-5 w-5 text-red-600" />
                                    Report UI Issue
                                </CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>&times;</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {success ? (
                                <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in">
                                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                                    <p className="font-semibold text-slate-900">Bug Logged Successfully!</p>
                                    <p className="text-sm text-slate-500">Antigravity will begin fixing it in the background.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-3 bg-slate-50 border rounded text-[10px] font-mono text-slate-600 overflow-hidden text-ellipsis whitespace-nowrap">
                                        <span className="font-bold text-slate-400">Selector:</span> {selectedElement?.selector}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bug-desc">What's wrong?</Label>
                                        <Textarea
                                            id="bug-desc"
                                            placeholder="e.g. This button is misaligned on mobile, or the color doesn't match the design."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={4}
                                            className={cn(error && "border-red-300")}
                                        />
                                        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                        <Button onClick={handleSubmit} disabled={loading || !description.trim()}>
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Save Bug"}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
