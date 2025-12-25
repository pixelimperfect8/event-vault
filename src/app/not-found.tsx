import Link from 'next/link'
import { Button } from "@/components/ui-components"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Not Found</h2>
            <p className="text-slate-500">Could not find requested resource</p>
            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    )
}
