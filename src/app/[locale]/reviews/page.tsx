import type { Metadata } from "next"
import { MessageSquare } from "lucide-react"
import { setRequestLocale, getTranslations } from "next-intl/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { StarDisplay } from "@/components/reviews/StarDisplay"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { ReviewList } from "@/components/reviews/ReviewList"
import type { Review } from "@/lib/types/review"

export const revalidate = 60

interface ReviewsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ReviewsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.reviews" })
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function ReviewsPage({ params }: ReviewsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("reviews")

  // Fetch approved reviews (cached via ISR, revalidated every 60s)
  const admin = createAdminClient()
  const { data: reviews } = await admin
    .from("reviews")
    .select("id, user_id, author_name, rating, comment, is_approved, created_at")
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(50)

  const reviewList = (reviews ?? []) as Review[]
  const avgRating =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + r.rating, 0) / reviewList.length
      : 0

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="font-serif text-4xl font-bold text-gray-900">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>
          <p className="text-gray-500 mt-3">{t("subtitle")}</p>
        </div>

        {/* Average Rating */}
        {reviewList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 text-center">
            <StarDisplay rating={Math.round(avgRating)} size="md" />
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {avgRating.toFixed(1)} <span className="text-sm font-normal text-gray-400">{t("outOf")}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t("totalReviews", { count: reviewList.length })}
            </p>
          </div>
        )}

        {/* Review Form (handles its own auth state client-side) */}
        <ReviewForm />

        {/* Review List */}
        {reviewList.length > 0 ? (
          <ReviewList reviews={reviewList} locale={locale} />
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">{t("noReviews")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
