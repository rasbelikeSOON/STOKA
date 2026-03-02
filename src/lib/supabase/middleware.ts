import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password', '/invite']

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

    const isPublicPath = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route)) || request.nextUrl.pathname === '/'

    if (!user && !isPublicPath) {
        const url = request.nextUrl.clone()
        url.pathname = '/signin'
        return NextResponse.redirect(url)
    }

    // If user is authenticated and trying to access auth pages, redirect to app
    if (user && (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup')) {
        const url = request.nextUrl.clone()
        url.pathname = '/app/chat'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
