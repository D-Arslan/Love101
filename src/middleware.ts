import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n for shared links and API routes
  if (pathname.startsWith("/l/") || pathname.startsWith("/api/")) {
    return handleSupabaseAuth(request)
  }

  // Run next-intl middleware (handles locale detection + redirect)
  let intlResponse: NextResponse
  try {
    intlResponse = intlMiddleware(request)
  } catch {
    // Fallback: if intl middleware fails, redirect root to default locale
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`/${routing.defaultLocale}`, request.url))
    }
    return NextResponse.next()
  }

  // If intl middleware wants to redirect (e.g. / -> /fr), return directly
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse
  }

  // Then handle Supabase auth on the response
  return handleSupabaseAuth(request, intlResponse)
}

async function handleSupabaseAuth(
  request: NextRequest,
  response?: NextResponse
): Promise<NextResponse> {
  let supabaseResponse = response ?? NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          if (!response) {
            supabaseResponse = NextResponse.next({ request })
          }
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

  const { pathname } = request.nextUrl

  // Extract locale from pathname (e.g., /fr/dashboard -> fr)
  const localeMatch = pathname.match(/^\/(fr|en|es)\//)
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale

  // Protect dashboard routes (with any locale prefix)
  const isDashboard = pathname.match(/^\/(fr|en|es)\/dashboard/)
  if (isDashboard && !user) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from auth pages
  const isAuthPage = pathname.match(/^\/(fr|en|es)\/auth\//)
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/",
    "/(fr|en|es)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
}
