import { Star } from "lucide-react"

interface StarDisplayProps {
  rating: number
  size?: "sm" | "md"
}

export function StarDisplay({ rating, size = "sm" }: StarDisplayProps) {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-7 w-7"

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  )
}
