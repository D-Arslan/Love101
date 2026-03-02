import { createClient } from "@/lib/supabase/server"
import { getTranslations } from "next-intl/server"
import { UserMenu } from "./UserMenu"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { MobileMenu } from "./MobileMenu"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { Logo } from "./Logo"
import { Link } from "@/i18n/navigation"

const navLinks = [
  { href: "/reviews" as const, key: "reviews" as const },
  { href: "/about" as const, key: "about" as const },
  { href: "/dates" as const, key: "dates" as const },
  { href: "/contact" as const, key: "contact" as const },
]

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const t = await getTranslations("common.nav")

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between relative">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Logo size="md" />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm text-gray-500 hover:text-rose-500 transition-colors"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <UserMenu email={user.email ?? ""} />
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-1.5" />
                {t("login")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <MobileMenu userEmail={user?.email} />
      </div>
    </header>
  )
}
