'use client'

import { Button } from "@/components/ui-components"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white">
                    <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
                    <Button onClick={() => reset()}>Try again</Button>
                </div>
            </body>
        </html>
    )
}
