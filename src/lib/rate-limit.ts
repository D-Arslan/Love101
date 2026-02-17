import { NextResponse } from "next/server"
import { headers } from "next/headers"

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export async function rateLimit(
  config: RateLimitConfig
): Promise<NextResponse | null> {
  const headersList = await headers()
  const forwarded = headersList.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown"

  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + config.windowMs })
    return null
  }

  entry.count++

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: "Trop de requetes. Reessaie dans quelques instants." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    )
  }

  return null
}
