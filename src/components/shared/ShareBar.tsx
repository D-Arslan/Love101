"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, Check, Share2, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"

interface ShareBarProps {
  cardId: string
  recipientName: string
}

export function ShareBar({ cardId, recipientName }: ShareBarProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/l/${cardId}`

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareWhatsApp() {
    const text = `💌 J'ai un message spécial pour ${recipientName} : ${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: `Un message pour ${recipientName}`,
        text: `💌 Découvre ce message spécial !`,
        url: shareUrl,
      })
    } else {
      copyLink()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-sm hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copier le lien</span>
              </>
            )}
          </button>

          <button
            onClick={shareNative}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
