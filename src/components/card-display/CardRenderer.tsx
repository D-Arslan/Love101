"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { getTemplate } from "@/templates"
import type { Card } from "@/lib/types/database"
import { Envelope } from "./Envelope"
import { Countdown } from "./Countdown"
import { Reasons } from "./Reasons"
import { Promises } from "./Promises"
import { Memories } from "./Memories"
import { Quiz } from "./Quiz"
import { QuizWithPrizes } from "./QuizWithPrizes"
import { Scratch } from "./Scratch"
import { SorryAlgorithm } from "./SorryAlgorithm"
import { RdvDetails } from "./RdvDetails"
import { RdvClues } from "./RdvClues"
import { Music } from "./Music"
import { ShareBar } from "@/components/shared/ShareBar"

interface CardRendererProps {
  card: Card
}

export function CardRenderer({ card }: CardRendererProps) {
  const template = getTemplate(card.template_type)
  const colors = card.theme_colors
  const config = card.custom_config || {}
  const features = template.features

  const hasEnvelope = features.includes("envelope")
  const [envelopeOpened, setEnvelopeOpened] = useState(!hasEnvelope)

  if (!envelopeOpened) {
    return (
      <Envelope
        colors={colors}
        recipientName={card.recipient_name}
        emoji={template.emoji}
        onOpen={() => setEnvelopeOpened(true)}
      />
    )
  }

  return (
    <div
      className="min-h-screen pt-16 py-8 px-4"
      style={{ backgroundColor: colors.background }}
    >
      <ShareBar cardId={card.id} recipientName={card.recipient_name} />

      <div className="max-w-lg mx-auto space-y-6">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
            style={{ backgroundColor: "#ffffff", color: colors.text }}
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
              <span className="font-medium" style={{ color: colors.secondary }}>
                {card.sender_name}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* RDV Details */}
        {features.includes("rdv-details") && config.rdv && (
          <RdvDetails
            rdv={config.rdv}
            primaryColor={colors.primary}
          />
        )}

        {/* RDV Clues */}
        {features.includes("rdv-clues") && config.rdv_clues && config.rdv_clues.length > 0 && (
          <RdvClues
            clues={config.rdv_clues}
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
          />
        )}

        {/* Countdown */}
        {features.includes("countdown") && config.countdown_date && (
          <Countdown
            targetDate={config.countdown_date}
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
          />
        )}

        {/* Sorry Algorithm (apology) */}
        {features.includes("sorry-algorithm") && (
          <SorryAlgorithm
            senderName={card.sender_name}
            primaryColor={colors.primary}
            secondaryColor={colors.secondary}
            customMessages={config.sorry_messages}
            customRefusals={config.sorry_refusals}
          />
        )}

        {/* Promises (apology) */}
        {features.includes("promises") && config.promises && config.promises.length > 0 && (
          <Promises
            promises={config.promises}
            primaryColor={colors.primary}
          />
        )}

        {/* Reasons / Pourquoi je t'aime (love-letter) */}
        {features.includes("reasons") && config.reasons && config.reasons.length > 0 && (
          <Reasons
            reasons={config.reasons}
            primaryColor={colors.primary}
          />
        )}

        {/* Memories / Nos meilleurs souvenirs (anniversary) */}
        {features.includes("memories") && config.memories && config.memories.length > 0 && (
          <Memories
            memories={config.memories}
            primaryColor={colors.primary}
          />
        )}

        {/* Quiz with prizes (quiz-game template) */}
        {features.includes("quiz-prizes") && config.quiz && config.quiz.length > 0 && (
          <QuizWithPrizes
            questions={config.quiz}
            prizes={config.quiz_prizes || []}
            primaryColor={colors.primary}
          />
        )}

        {/* Quiz without prizes (anniversary template) */}
        {features.includes("quiz") && !features.includes("quiz-prizes") && config.quiz && config.quiz.length > 0 && (
          <Quiz
            questions={config.quiz}
            primaryColor={colors.primary}
          />
        )}

        {/* Scratch */}
        {features.includes("scratch") && config.scratch_text && (
          <Scratch
            revealText={config.scratch_text}
            primaryColor={colors.primary}
          />
        )}

        {/* Template badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="text-center pt-4"
        >
          <span className="text-xs" style={{ color: colors.text, opacity: 0.4 }}>
            {template.emoji} {template.name} — Love101
          </span>
        </motion.div>
      </div>

      {/* Music player (floating) */}
      {features.includes("music") && config.music_enabled !== false && (
        <Music
          musicUrl={config.music_url}
          primaryColor={colors.primary}
        />
      )}
    </div>
  )
}
