import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-rose-400" />
      </div>
    </div>
  )
}
