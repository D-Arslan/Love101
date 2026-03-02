"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Menu, X, LogIn, Globe } from "lucide-react"
import { Link, useRouter, usePathname } from "@/i18n/navigation"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/reviews" as const, key: "reviews" as const },
  { href: "/about" as const, key: "about" as const },
  { href: "/dates" as const, key: "dates" as const },
  { href: "/contact" as const, key: "contact" as const },
]

const locales = [
  { code: "fr" as const, label: "FR" },
  { code: "en" as const, label: "EN" },
  { code: "es" as const, label: "ES" },
]

interface MobileMenuProps {
  userEmail?: string | null
}

export function MobileMenu({ userEmail }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations("common.nav")
  const tUser = useTranslations("common.userMenu")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: "fr" | "en" | "es") {
    router.replace(pathname, { locale: newLocale })
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}

            {userEmail && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                {tUser("dashboard")}
              </Link>
            )}

            <div className="border-t border-gray-100 pt-3 mt-3 flex items-center justify-between">
              {/* Language selector */}
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-gray-400" />
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      locale === l.code
                        ? "bg-rose-100 text-rose-600 font-medium"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {!userEmail && (
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    {t("login")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
