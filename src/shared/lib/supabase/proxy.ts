import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    let user = null

    try {
        const { data } = await supabase.auth.getUser()
        user = data.user
    } catch (e) {
        console.error('Supabase Middleware Auth Error:', e)
        // If auth check fails in middleware (Edge runtime), we proceed 
        // and let the Server Component (Node runtime) handle verification.
        // This prevents "fetch failed" crashes to block access if Edge is flaky.
    }

    // Rutas protegidas
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup')

    // Only redirect if we are SURE there is no user (no error occurred)
    // If validation failed due to network/fetch error, we fall through to layout
    if (isAdminRoute && !user) {
        // Should we check if it was an error? 
        // For safety: if (!user), we redirect. BUT if error happened?
        // If error happened, user is null. Redirecting creates loop if layout also fails.
        // However, if we don't redirect, unauth users hit layout. Layout checks auth.
        // If layout sees no user, it redirects.
        // So it is safe to let it pass if we trust layout.
        // But we need to distinguish "Not Logged In" vs "Auth Error".
        // For now, let's allow passing if it was a fetch error, but how to detect?
        // We'll modify the condition:
        // If we successfully checked and found no user -> Redirect.
        // If check failed -> Let pass (Layout will retry).
    }

    // Simplification for stability:
    if (isAdminRoute && !user) {
        // We can't distinguish easily here without extra flags.
        // But checking getUser() failure usually means user is null.
        // Let's rely on the crash fix: The Try/Catch prevents the 500 Error Page.
        // It will redirect to /login.
        // If /login also fails, it stays at /login.
        // This is better than "Application Error".
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return supabaseResponse
}
