import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for Server Components, Server Actions, and Route Handlers.
 * Optimized for Next.js 16 and Turbopack.
 */
export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Defensive check for Turbopack resolution issues
    if (typeof createServerClient !== 'function') {
        console.error("Critical: createServerClient is not a function. Check @supabase/ssr installation.");
        throw new Error("Supabase initialization failed: createServerClient is undefined");
    }

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase Security: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    return createServerClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseAnonKey || "placeholder-key",
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    )
}
