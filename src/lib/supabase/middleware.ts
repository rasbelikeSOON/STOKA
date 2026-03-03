import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/invite']

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname
    const isPublicPath =
        pathname === '/' ||
        publicRoutes.some(route => pathname.startsWith(route)) ||
        pathname.startsWith('/api')

    const isAppRoute = pathname.startsWith('/app')
    const isOnboarding = pathname === '/onboarding'

    // 1. Unauthenticated users -> /signin for app routes
    if (!user && (isAppRoute || isOnboarding)) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // 2. Authenticated users on auth pages -> /app/chat
    if (user && (pathname === '/signin' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/app/chat', request.url))
    }

    // 3. Onboarding check for authenticated users
    if (user && isAppRoute) {
        // We check if user has a business
        const { data: member } = await supabase
            .from('business_members')
            .select('business_id')
            .eq('user_id', user.id)
            .maybeSingle()

        if (!member) {
            return NextResponse.redirect(new URL('/onboarding', request.url))
        }
    }

    return supabaseResponse
}
