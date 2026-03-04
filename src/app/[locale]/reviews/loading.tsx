import { Loader2 } from "lucide-react"

export default function ReviewsLoading() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    </div>
  )
}
