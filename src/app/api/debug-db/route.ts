import { NextResponse } from "next/server"
import { db } from "@/lib/db-client"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }

    try {
        console.log(`Debugging DB update for ${email}...`)

        // 1. Try to find the user first
        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
            return NextResponse.json({ error: "User not found", email }, { status: 404 })
        }

        // 2. Try to update
        // We bypass the class method to see the raw error if possible, 
        // OR we trust our modified db client to log it. 
        // Actually, let's use the db client as is, because we added logs there.
        // But to capture the error returned by Supabase, we need to modify db-client again to THROW or RETURN error.
        // Currently it returns NULL on error.

        const updated = await db.user.update({
            where: { email },
            data: { hasCompletedOnboarding: true }
        })

        if (!updated) {
            return NextResponse.json({
                status: "Failed",
                message: "db.user.update returned null. Check server logs."
            }, { status: 500 })
        }

        return NextResponse.json({ status: "Success", user: updated })

    } catch (e: unknown) {
        const error = e as Error
        return NextResponse.json({
            error: "Exception thrown",
            details: error.message,
            stack: error.stack
        }, { status: 500 })
    }
}
