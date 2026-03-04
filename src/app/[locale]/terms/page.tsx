import type { Metadata } from "next"
import { FileText, UserCircle, Pencil, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react"
import { setRequestLocale, getTranslations } from "next-intl/server"

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.terms" })
  return {
    title: t("title"),
    description: t("description"),
  }
}

const sections = [
  { key: "service" as const, icon: FileText, color: "bg-blue-50", iconColor: "text-blue-500" },
  { key: "accounts" as const, icon: UserCircle, color: "bg-purple-50", iconColor: "text-purple-500" },
  { key: "content" as const, icon: Pencil, color: "bg-pink-50", iconColor: "text-pink-500" },
  { key: "usage" as const, icon: ShieldCheck, color: "bg-green-50", iconColor: "text-green-500" },
  { key: "liability" as const, icon: AlertTriangle, color: "bg-amber-50", iconColor: "text-amber-500" },
  { key: "changes" as const, icon: RefreshCw, color: "bg-indigo-50", iconColor: "text-indigo-500" },
]

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("terms")

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-4">📜</div>
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
