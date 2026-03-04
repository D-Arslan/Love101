import type { Metadata } from "next"
import { Shield, Database, Lock, Cookie, UserCheck, Clock } from "lucide-react"
import { setRequestLocale, getTranslations } from "next-intl/server"

interface PrivacyPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.privacy" })
  return {
    title: t("title"),
    description: t("description"),
  }
}

const sections = [
  { key: "dataCollected" as const, icon: Database, color: "bg-blue-50", iconColor: "text-blue-500" },
  { key: "dataUsage" as const, icon: Shield, color: "bg-purple-50", iconColor: "text-purple-500" },
  { key: "dataSecurity" as const, icon: Lock, color: "bg-green-50", iconColor: "text-green-500" },
  { key: "cookies" as const, icon: Cookie, color: "bg-amber-50", iconColor: "text-amber-500" },
  { key: "rights" as const, icon: UserCheck, color: "bg-rose-50", iconColor: "text-rose-500" },
  { key: "retention" as const, icon: Clock, color: "bg-indigo-50", iconColor: "text-indigo-500" },
]

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("privacy")

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="font-serif text-4xl font-bold text-gray-900">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">{t("lastUpdated")}</p>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">{t("intro")}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.key}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`h-10 w-10 rounded-full ${section.color} flex items-center justify-center shrink-0`}
                >
                  <section.icon className={`h-5 w-5 ${section.iconColor}`} />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-gray-900 mb-2">
                    {t(`sections.${section.key}.title`)}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(`sections.${section.key}.text`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
