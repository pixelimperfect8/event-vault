
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { db } from "@/lib/db-client"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    // Adapter removed to avoid Prisma dependency
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-secret",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    return null
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) return null

                return { id: user.id, email: user.email, name: user.name, role: user.role }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                if (!user.email) return false

                // Check if user exists
                const existingUser = await db.user.findUnique({
                    where: { email: user.email }
                })

                if (existingUser) {
                    return true // Allow sign in, existing account found
                }

                // Create new user if not exists
                await db.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        password: null, // Google users have no password
                    }
                })
                return true
            }
            return true
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                // @ts-ignore
                session.user.id = token.sub
                // @ts-ignore
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user, account }) {
            if (user) {
                // Initial sign in
                if (account) {
                    if (account.provider === "google") {
                        const dbUser = await db.user.findUnique({
                            where: { email: user.email! }
                        })
                        if (dbUser) {
                            token.sub = dbUser.id
                            token.role = dbUser.role
                        }
                    } else {
                        token.sub = user.id
                        // @ts-ignore
                        token.role = user.role
                    }
                }
            }
            return token
        }
    }
}
