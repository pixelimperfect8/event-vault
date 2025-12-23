
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { User, Event, Contract } from "@/lib/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)



class SupabaseClient {
    public user = {
        findUnique: async ({ where }: { where: { email: string } }) => {
            const { data, error } = await supabase // eslint-disable-line @typescript-eslint/no-explicit-any
                .from('users')
                .select('*')
                .eq('email', where.email)
                .single()

            if (error || !data) return null

            // Hardcode App Master for ivan@pixelimperfect.io
            if (data.email === 'ivan@pixelimperfect.io') {
                data.role = 'APP_MASTER'
            } else {
                data.role = data.role || 'USER'
            }

            return data as User
        },
        create: async ({ data }: { data: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            // Check for App Master email during creation
            const role = data.email === 'ivan@pixelimperfect.io' ? 'APP_MASTER' : 'USER'
            const { data: newUser, error } = await supabase // eslint-disable-line @typescript-eslint/no-explicit-any
                .from('users')
                .insert({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role,
                    "hasCompletedOnboarding": false,
                    // createdAt/updatedAt handled by default in DB or we can send them
                    "updatedAt": new Date().toISOString(),
                    "createdAt": new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return newUser as User
        },
        update: async ({ where, data }: { where: { email: string }, data: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const { data: updatedUser, error } = await supabase // eslint-disable-line @typescript-eslint/no-explicit-any
                .from('users')
                .update({
                    ...data,
                    "updatedAt": new Date().toISOString()
                })
                .eq('email', where.email)
                .select()
                .single()

            if (error) {
                console.error("Supabase Update Error:", error)
                return null
            }
            return updatedUser as User
        }
    }

    public event = {
        findMany: async ({ where }: { where: { userId: string } }) => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('userId', where.userId)

            if (error) return []
            return data as Event[]
        },
        findUnique: async ({ where }: { where: { id: string } }) => {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', where.id)
                .single()

            if (error) return null
            return data as Event
        },
        create: async ({ data }: { data: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const { data: newEvent, error } = await supabase
                .from('events')
                .insert({
                    "userId": data.userId,
                    name: data.name,
                    "clientName": data.clientName,
                    type: data.type || 'Other',
                    status: data.status || 'PLANNING',
                    "startDate": data.startDate,
                    "endDate": data.endDate,
                    "startTime": data.startTime,
                    "endTime": data.endTime,
                    "venueName": data.venueName,
                    "venueAddress": data.venueAddress,
                    timezone: data.timezone || 'UTC',
                    sections: data.sections || [],
                    "updatedAt": new Date().toISOString(),
                    "createdAt": new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return newEvent as Event
        }
    };

    public contract = {
        findMany: async ({ where }: { where: { eventId: string } }) => {
            const { data, error } = await supabase
                .from('contracts')
                .select('*')
                .eq('eventId', where.eventId)

            if (error) return []
            return data as Contract[]
        },
        create: async ({ data }: { data: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const { data: newContract, error } = await supabase
                .from('contracts')
                .insert({
                    "eventId": data.eventId,
                    title: data.title,
                    status: 'DRAFT',
                    versions: [], // JSON default
                    "updatedAt": new Date().toISOString(),
                    "createdAt": new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return newContract as Contract
        }
    };

    public bug = {
        create: async ({ data }: { data: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.log("[DEBUG] Supabase Insert Data (snake_case):", data)
            const { data: newBug, error } = await (supabase as any) // eslint-disable-line @typescript-eslint/no-explicit-any
                .from('bugs')
                .insert({
                    "reporter_id": data.reporterId,
                    "element_selector": data.elementSelector,
                    "element_text": data.elementText,
                    "description": data.description,
                    "status": 'PENDING',
                    "updated_at": new Date().toISOString(),
                    "created_at": new Date().toISOString()
                })
                .select()
                .single()

            if (error) {
                console.error("[ERROR] Supabase Insert Error:", error)
                throw error
            }
            return newBug
        },
        update: async ({ where, data }: { where: { id: string }, data: any }) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            const { data: updatedBug, error } = await supabase
                .from('bugs')
                .update({
                    "status": data.status,
                    "updated_at": new Date().toISOString()
                })
                .eq('id', where.id)
                .select()
                .single()

            if (error) {
                console.error("[ERROR] Supabase Bug Update Error:", error)
                throw error
            }
            return updatedBug
        },
        findMany: async ({ where }: { where: { reporterId?: string } }) => {
            let query = supabase.from('bugs').select('*')
            if (where.reporterId) query = query.eq('reporter_id', where.reporterId)
            const { data, error } = await query
            if (error) {
                console.error("[ERROR] Supabase findMany Bugs Error:", error)
                return []
            }
            return data
        }
    };
}

export const db = new SupabaseClient();
