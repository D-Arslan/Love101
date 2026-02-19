import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://love101.app"

const staticPages = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/create", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/dates", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/auth/login", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/auth/signup", changeFrequency: "monthly" as const, priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of staticPages) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  return entries
}
