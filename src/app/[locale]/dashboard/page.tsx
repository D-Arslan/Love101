import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { CardStats } from "@/components/dashboard/CardStats"
import { CardList } from "@/components/dashboard/CardList"
import { setRequestLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: DashboardPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.dashboard" })
  return { title: t("title") }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("dashboard")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const admin = createAdminClient()

  const { data: cards } = await admin
    .from("cards")
    .select("id, template_type, recipient_name, sender_name, created_at, is_published")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  const cardIds = (cards ?? []).map((c: { id: string }) => c.id)
  let viewCounts: Record<string, number> = {}

  if (cardIds.length > 0) {
    const { data: views } = await admin
      .from("card_views")
      .select("card_id")
      .in("card_id", cardIds)

    viewCounts = (views ?? []).reduce(
      (acc: Record<string, number>, v: { card_id: string }) => {
        acc[v.card_id] = (acc[v.card_id] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }

  const cardsWithViews = (cards ?? []).map(
    (card: {
      id: string
      template_type: string
      recipient_name: string
      sender_name: string
      created_at: string
      is_published: boolean
    }) => ({
      ...card,
      view_count: viewCounts[card.id] || 0,
    })
  )

  const totalViews = cardsWithViews.reduce(
    (sum: number, c: { view_count: number }) => sum + c.view_count,
    0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-500 mb-8">{t("subtitle")}</p>

        <CardStats totalCards={cardsWithViews.length} totalViews={totalViews} />

        <CardList cards={cardsWithViews} />
      </div>
    </div>
  )
}
