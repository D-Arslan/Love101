import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock next/server and next/headers before importing
vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number; headers?: Record<string, string> }) => ({
      body,
      status: init?.status ?? 200,
      headers: init?.headers ?? {},
    }),
  },
}))

let mockIp = "127.0.0.1"

vi.mock("next/headers", () => ({
  headers: () =>
    Promise.resolve({
      get: (name: string) => (name === "x-forwarded-for" ? mockIp : null),
    }),
}))

// Import after mocks
const { rateLimit } = await import("@/lib/rate-limit")

describe("rateLimit", () => {
  beforeEach(() => {
    // Use a unique IP per test to avoid cross-test interference
    mockIp = `192.168.1.${Math.floor(Math.random() * 254) + 1}`
  })

  it("should allow requests under the limit", async () => {
    const result = await rateLimit({ maxRequests: 5, windowMs: 60_000 })
    expect(result).toBeNull()
  })

  it("should block requests over the limit", async () => {
    mockIp = "10.0.0.1"
    const config = { maxRequests: 3, windowMs: 60_000 }

    // First 3 should pass
    for (let i = 0; i < 3; i++) {
      const result = await rateLimit(config)
      expect(result).toBeNull()
    }

    // 4th should be blocked
    const blocked = await rateLimit(config)
    expect(blocked).not.toBeNull()
    expect(blocked?.status).toBe(429)
  })

  it("should track different IPs separately", async () => {
    const config = { maxRequests: 1, windowMs: 60_000 }

    mockIp = "10.0.0.2"
    expect(await rateLimit(config)).toBeNull()

    mockIp = "10.0.0.3"
    expect(await rateLimit(config)).toBeNull()
  })
})
