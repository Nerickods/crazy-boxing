import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function POST(request: NextRequest) {
    const { email, password } = await request.json()

    // Create response to set cookies on
    const response = NextResponse.json({ success: true, redirect: '/admin' })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 401 }
        )
    }

    // Return response with cookies set
    return NextResponse.json({
        success: true,
        redirect: '/admin',
        user: {
            id: data.user?.id,
            email: data.user?.email,
        }
    }, {
        headers: response.headers,
    })
}
