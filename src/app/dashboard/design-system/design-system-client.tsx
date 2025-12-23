"use client"

import { useState } from "react"
import { Palette, Type, Component, Copy, Check, Box } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button, Input, Card, CardHeader, CardContent, Label, Select, Textarea } from "@/components/ui-components"

const COLORS = [
    { name: 'Indigo 600', hex: '#4f46e5', class: 'bg-indigo-600' },
    { name: 'Slate 900', hex: '#0f172a', class: 'bg-slate-900' },
    { name: 'Slate 500', hex: '#64748b', class: 'bg-slate-500' },
    { name: 'Green 500', hex: '#22c55e', class: 'bg-green-500' },
    { name: 'Red 600', hex: '#dc2626', class: 'bg-red-600' },
    { name: 'Amber 500', hex: '#f59e0b', class: 'bg-amber-500' },
]

const TYPOGRAPHY = [
    { label: 'Display Large', size: 'text-5xl', weight: 'font-black', tracking: 'tracking-tighter' },
    { label: 'Heading 1', size: 'text-3xl', weight: 'font-bold', tracking: 'tracking-tight' },
    { label: 'Body Lead', size: 'text-lg', weight: 'font-medium', tracking: 'normal text-slate-600' },
    { label: 'Body Base', size: 'text-sm', weight: 'font-normal', tracking: 'normal text-slate-700' },
    { label: 'Caption', size: 'text-[10px]', weight: 'font-bold', tracking: 'uppercase tracking-widest text-slate-400' },
]

export function DesignSystemClient() {
    const [activeSection, setActiveSection] = useState<'tokens' | 'components'>('tokens')
    const [copied, setCopied] = useState<string | null>(null)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(text)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="space-y-12">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveSection('tokens')}
                    className={cn(
                        "pb-4 text-sm font-bold transition-all relative",
                        activeSection === 'tokens' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Design Tokens
                    {activeSection === 'tokens' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveSection('components')}
                    className={cn(
                        "pb-4 text-sm font-bold transition-all relative",
                        activeSection === 'components' ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                    )}
                >
                    Component Sheet
                    {activeSection === 'components' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
                </button>
            </div>

            {activeSection === 'tokens' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Colors */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Palette className="h-4 w-4 text-slate-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Color Palette</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {COLORS.map(color => (
                                <button
                                    key={color.name}
                                    onClick={() => copyToClipboard(color.hex)}
                                    className="group relative text-left space-y-2 p-2 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className={cn("aspect-square rounded-xl shadow-inner", color.class)} />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">{color.name}</p>
                                        <p className="text-[10px] font-mono text-slate-400">{color.hex}</p>
                                    </div>
                                    <div className="absolute top-4 right-4 h-6 w-6 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {copied === color.hex ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3 text-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Typography */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                <Type className="h-4 w-4 text-slate-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Typography</h2>
                        </div>
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
                            {TYPOGRAPHY.map(type => (
                                <div key={type.label} className="space-y-2 group">
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">{type.label}</p>
                                    <p className={cn(type.size, type.weight, type.tracking, "transition-all group-hover:pl-2 border-l-2 border-transparent group-hover:border-indigo-100")}>
                                        The quick brown fox jumps over the lazy dog
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeSection === 'components' && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Component className="h-4 w-4 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Registered Components</h2>
                        </div>
                        <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                            AUTO-SYNC ACTIVE
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                        {/* Section: Buttons */}
                        <ComponentSection title="Interaction / Buttons">
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button>Primary Action</Button>
                                <Button variant="secondary">Secondary Action</Button>
                                <Button variant="outline">Outline Action</Button>
                                <Button variant="ghost">Ghost Action</Button>
                                <Button variant="destructive">Destructive</Button>
                            </div>
                        </ComponentSection>

                        {/* Section: Inputs */}
                        <ComponentSection title="Forms / Controls">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                                <div className="space-y-2">
                                    <Label>Text Input</Label>
                                    <Input placeholder="Enter placeholder text..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Select Dropdown</Label>
                                    <Select>
                                        <option>Select an option</option>
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Text Area</Label>
                                    <Textarea placeholder="Type your message here..." />
                                </div>
                            </div>
                        </ComponentSection>

                        {/* Section: Cards */}
                        <ComponentSection title="Containment / Cards">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <h3 className="font-bold">Standard Card</h3>
                                        <p className="text-xs text-slate-500">Subtext or description goes here.</p>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-slate-700 leading-relaxed italic border-l-4 border-indigo-500 pl-4">
                                            &quot;Design is not just what it looks like and feels like. Design is how it works.&quot;
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </ComponentSection>
                    </div>

                    {/* Auto-registration Notice */}
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Box className="h-64 w-64 rotate-12" />
                        </div>
                        <div className="relative z-10 max-w-xl space-y-4">
                            <h3 className="text-2xl font-black">AI Auto-Registry</h3>
                            <p className="text-indigo-100 font-medium leading-relaxed">
                                I&apos;ve established an automated workflow. Every time I create or modify a component in the `src/components` directory, I will automatically document it here.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function ComponentSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 inline-flex items-center gap-2">
                {title}
                <div className="h-[1px] w-12 bg-slate-200" />
            </h3>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                {children}
            </div>
        </div>
    )
}
