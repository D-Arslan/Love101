import { Heart } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Logo } from "@/components/shared/Logo"
import { Link } from "@/i18n/navigation"

export async function Footer() {
  const t = await getTranslations("common.footer")

  return (
    <footer className="bg-gray-50 border-t border-gray-100 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        <div className="flex items-center justify-center mb-3">
          <Logo size="md" />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {t("tagline")}
        </p>
        <div className="flex items-center justify-center gap-4 mb-4 text-sm">
          <Link href="/dates" className="text-gray-500 hover:text-rose-500 transition-colors">
            {t("dateIdeas")}
          </Link>
          <Link href="/contact" className="text-gray-500 hover:text-rose-500 transition-colors">
            {t("contact")}
          </Link>
        </div>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
          <span>{t("madeWith")}</span>
          <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
          <span>— {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
