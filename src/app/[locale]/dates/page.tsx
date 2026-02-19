import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { Button } from "@/components/ui/button"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

interface DatesPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: DatesPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.dates" })
  return {
    title: t("title"),
    description: t("description"),
  }
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const emojis: Record<string, string> = {
  A: "👨‍🍳", B: "🌅", C: "🎬", D: "🍫", E: "🔐", F: "🎡",
  G: "🎮", H: "🏨", I: "🎭", J: "🌺", K: "🎤", L: "💌",
  M: "🌙", N: "⭐", O: "🦢", P: "🧺", Q: "❓", R: "🚗",
  S: "🧖", T: "👗", U: "🎵", V: "🖼️", W: "📵", X: "🪂",
  Y: "🧘", Z: "🐧",
}

export default async function DatesPage({ params }: DatesPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("dates")

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="text-center px-4 pt-12 pb-8">
        <div className="flex justify-center mb-3">
          <Logo size="lg" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          {t("title")}{" "}
          <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            {t("titleHighlight")}
          </span>
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto text-lg">
          {t("subtitle")}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {letters.map((letter) => (
            <div
              key={letter}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center shrink-0">
                  <span className="font-serif text-xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                    {letter}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-lg">{emojis[letter]}</span>
                    {t(`ideas.${letter}.title`)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {t(`ideas.${letter}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {t("cta")}
          </p>
          <Link href="/create?template=rdv">
            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-6 rounded-full text-lg">
              {t("ctaButton")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
