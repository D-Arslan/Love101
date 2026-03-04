import { Heart } from "lucide-react"
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
        </div>
      </div>
    </footer>
  )
}
