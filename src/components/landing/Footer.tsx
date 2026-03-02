import { Heart, Instagram } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Logo } from "@/components/shared/Logo"
import { Link } from "@/i18n/navigation"

export async function Footer() {
  const t = await getTranslations("common.footer")

  return (
    <footer className="bg-gray-50 border-t border-gray-100 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo size="md" />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              {t("sections.explore")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.createMessage")}
                </Link>
              </li>
              <li>
                <Link href="/dates" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.dateIdeas")}
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.reviews")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              {t("sections.company")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              {t("sections.legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-rose-500 transition-colors">
                  {t("links.termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span>{t("madeWith")}</span>
            <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
            <span>— &copy; {new Date().getFullYear()} Love101. {t("allRightsReserved")}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors" aria-label="X">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors" aria-label="TikTok">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.1a8.16 8.16 0 005.58 2.2V11.3a4.85 4.85 0 01-3.77-1.84V6.69z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
