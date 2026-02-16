import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'

/**
 * Verifies the current user is authenticated and has the 'admin' role.
 * Returns the user object if authorized, or a NextResponse error if not.
 * 
 * Usage in API routes:
 * ```ts
 * const authResult = await requireAdmin()
 * if (authResult instanceof NextResponse) return authResult
 * const user = authResult
 * ```
 */
export async function requireAdmin(): Promise<{ id: string; email: string; role: string } | NextResponse> {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json(
                { error: 'Unauthorized: Authentication required' },
                { status: 401 }
            )
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role, email')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json(
                { error: 'Forbidden: Admin access required' },
                { status: 403 }
            )
        }

        return { id: user.id, email: profile.email, role: profile.role }
    } catch {
        return NextResponse.json(
            { error: 'Internal server error during authentication' },
            { status: 500 }
        )
    }
}
