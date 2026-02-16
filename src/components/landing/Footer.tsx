import { Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">💌</span>
          <span className="font-serif text-xl font-bold text-gray-900">
            Love101
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Crée des messages personnalisés qui font craquer.
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
          <span>Fait avec</span>
          <Heart className="h-3 w-3 text-rose-400 fill-rose-400" />
          <span>— {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
