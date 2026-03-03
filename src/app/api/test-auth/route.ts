import { cookies, headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const headersList = await headers()

    // Convert headers to a standard object for easy reading
    const headersObj: Record<string, string> = {}
    headersList.forEach((val, key) => {
        headersObj[key] = val
    })

    return NextResponse.json({
        cookies: allCookies,
        headers: headersObj
    })
}
