"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)
  const t = useTranslations("reviews.stars")

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={t(String(star) as "1" | "2" | "3" | "4" | "5")}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (hovered || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
