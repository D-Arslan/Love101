import { StarDisplay } from "./StarDisplay"
import type { Review } from "@/lib/types/review"

interface ReviewListProps {
  reviews: Review[]
  locale: string
}

export function ReviewList({ reviews, locale }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">{review.author_name}</p>
              <p className="text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <StarDisplay rating={review.rating} />
          </div>
          <p className="text-sm text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}
