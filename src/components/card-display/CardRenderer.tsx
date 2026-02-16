"use client"

import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { getTemplate } from "@/templates"
import type { Card } from "@/lib/types/database"

interface CardRendererProps {
  card: Card
}

export function CardRenderer({ card }: CardRendererProps) {
  const template = getTemplate(card.template_type)
  const colors = card.theme_colors

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div
          className="rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            color: colors.text,
          }}
        >
          {/* Decorative top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            }}
          />

          {/* Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-6xl mb-6"
          >
            {template.emoji}
          </motion.div>

          {/* Recipient */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Pour {card.recipient_name}
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-16 h-0.5 mx-auto my-5 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap mb-8 max-w-md mx-auto"
          >
            {card.message}
          </motion.p>

          {/* Sender */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center justify-center gap-2"
          >
            <Heart
              className="h-4 w-4"
              style={{ color: colors.primary }}
              fill={colors.primary}
            />
            <span
              className="font-medium"
              style={{ color: colors.secondary }}
            >
              {card.sender_name}
            </span>
          </motion.div>

          {/* Template badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="mt-8 pt-6 border-t border-gray-100"
          >
            <span className="text-xs text-gray-400">
              {template.emoji} {template.name} — Love101
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
