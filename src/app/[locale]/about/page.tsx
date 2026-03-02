import type { Metadata } from "next"
import { Heart, Target, Sparkles, Users, ArrowRight } from "lucide-react"
import { Logo } from "@/components/shared/Logo"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.about" })
  return {
    title: t("title"),
    description: t("description"),
  }
}

const sections = [
  { key: "origin" as const, icon: Heart, color: "bg-rose-50", iconColor: "text-rose-500" },
  { key: "mission" as const, icon: Target, color: "bg-purple-50", iconColor: "text-purple-500" },
  { key: "passion" as const, icon: Sparkles, color: "bg-pink-50", iconColor: "text-pink-500" },
  { key: "community" as const, icon: Users, color: "bg-indigo-50", iconColor: "text-indigo-500" },
]

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("about")

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-900">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-lg text-gray-500 mt-4 italic max-w-lg mx-auto">
            {t("heroText")}
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div
              key={section.key}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div
                className={`h-10 w-10 rounded-full ${section.color} flex items-center justify-center mb-4`}
              >
                <section.icon className={`h-5 w-5 ${section.iconColor}`} />
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">
                {t(`sections.${section.key}.title`)}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t(`sections.${section.key}.text`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <p className="text-lg font-medium text-gray-700 mb-4">{t("cta")}</p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 transition-all shadow-lg shadow-rose-200"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
