"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { createReviewSchema } from "@/lib/validators/review"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { StarRating } from "./StarRating"
import { Link } from "@/i18n/navigation"
import type { Review } from "@/lib/types/review"

export function ReviewForm() {
  const router = useRouter()
  const t = useTranslations("reviews.form")

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAuthState() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)

      if (user) {
        const { data } = await supabase
          .from("reviews")
          .select("*")
          .eq("user_id", user.id)
          .single()
        if (data) {
          setExistingReview(data as Review)
          setName(data.author_name)
          setRating(data.rating)
          setComment(data.comment)
        }
      }
      setIsLoading(false)
    }
    loadAuthState()
  }, [])

  const isEditing = !!existingReview

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 text-center">
        <p className="text-sm text-gray-500 mb-2">{t("loginRequired")}</p>
        <Link
          href="/auth/login"
          className="text-rose-600 hover:underline font-medium text-sm"
        >
          {t("loginLink")}
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = createReviewSchema.safeParse({
      author_name: name,
      rating,
      comment,
    })
    if (!result.success) {
      setError(result.error.issues[0].message)
      setIsSubmitting(false)
      return
    }

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    })

    if (!response.ok) {
      toast.error(t("errorToast"))
      setIsSubmitting(false)
      return
    }

    toast.success(t("successToast"))
    setIsSubmitting(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-4">
      {isEditing && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-2 text-center">
          {t("alreadyReviewed")}
        </p>
      )}

      <h2 className="font-serif text-xl font-bold text-gray-900">
        {t("title")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="review-name">{t("nameLabel")}</Label>
          <Input
            id="review-name"
            type="text"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("ratingLabel")}</Label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="review-comment">{t("commentLabel")}</Label>
          <textarea
            id="review-comment"
            placeholder={t("commentPlaceholder")}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 rounded-lg p-2 text-center">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting || rating === 0}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {isSubmitting
            ? isEditing
              ? t("updating")
              : t("submitting")
            : isEditing
              ? t("updateButton")
              : t("submit")}
        </Button>
      </form>
    </div>
  )
}
