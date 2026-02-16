"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DEFAULT_SORRY_MESSAGES, DEFAULT_SORRY_REFUSALS } from "@/lib/sorry-defaults"

interface SorryAlgorithmProps {
  senderName: string
  primaryColor: string
  secondaryColor: string
  customMessages?: string[]
  customRefusals?: string[]
}

const MILESTONES: Record<number, string> = {
  5: "🐶 MODE CHIOT ABANDONNE ACTIVE — *te regarde avec des grands yeux tristes*",
  10: "🚨 ALERTE NIVEAU ORANGE : DESESPOIR CRITIQUE — Les serveurs de pardon sont en surchauffe !",
  15: "🔴 CODE ROUGE : SUPPLICATION MAXIMALE — Ce programme consomme maintenant 100% de mon coeur.",
}

const CONFETTI_COLORS = ["#ff6b6b", "#ffa726", "#66bb6a", "#42a5f5", "#ab47bc", "#ffd54f", "#ff7043"]

const CELEBRATION_MESSAGES = [
  "🎉 JE SUIS LA PERSONNE LA PLUS HEUREUSE DU MONDE !!!",
  "🌟 Tu es la meilleure personne de l'univers. Officiel.",
  "💛 Je savais que tu avais un coeur en or !",
  "💃 YOUHOUUUUU ! *danse de la joie*",
  "🤞 Promis, je ne recommencerai plus ! (probablement)",
]

// Deterministic pseudo-random for confetti (avoids hydration issues)
function seeded(i: number) {
  return Math.sin(i * 9301 + 49297) * 0.5 + 0.5
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className="font-medium" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}

export function SorryAlgorithm({
  senderName,
  primaryColor,
  secondaryColor,
  customMessages,
  customRefusals,
}: SorryAlgorithmProps) {
  const messages = useMemo(
    () => (customMessages && customMessages.length > 0 ? customMessages : DEFAULT_SORRY_MESSAGES),
    [customMessages]
  )
  const refusals = useMemo(
    () => (customRefusals && customRefusals.length > 0 ? customRefusals : DEFAULT_SORRY_REFUSALS),
    [customRefusals]
  )

  const [attempt, setAttempt] = useState(0)
  const [refusalText, setRefusalText] = useState<string | null>(null)
  const [milestone, setMilestone] = useState<string | null>(null)
  const [forgiven, setForgiven] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [celebrationStep, setCelebrationStep] = useState(0)

  const desespoir = Math.min(100, 10 + attempt * 7)
  const supplication = Math.min(100, 5 + attempt * 9)
  const larmes = Math.min(100, attempt * 12)
  const credibilite = Math.max(0, 95 - attempt * 5)

  const currentMessage = messages[attempt % messages.length]

  const noButtonScale = attempt >= 8 ? Math.max(0.5, 1 - (attempt - 7) * 0.06) : 1
  const noButtonOpacity = attempt >= 12 ? Math.max(0.3, 1 - (attempt - 12) * 0.1) : 1
  const yesButtonScale = attempt >= 8 ? Math.min(1.5, 1 + (attempt - 7) * 0.07) : 1

  const handleNo = useCallback(() => {
    const nextAttempt = attempt + 1
    setAttempt(nextAttempt)
    setRefusalText(refusals[attempt % refusals.length])

    if (MILESTONES[nextAttempt]) {
      setMilestone(MILESTONES[nextAttempt])
      setTimeout(() => setMilestone(null), 4000)
    } else if (nextAttempt >= 20 && nextAttempt % 5 === 0) {
      setMilestone(`🏆 LEGENDAIRE — ${nextAttempt} tentatives ! Meme Chuck Norris aurait pardonne a ce stade.`)
      setTimeout(() => setMilestone(null), 4000)
    }

    setTimeout(() => setRefusalText(null), 2500)
  }, [attempt, refusals])

  const handleYes = useCallback(() => {
    setForgiven(true)
    setShowConfetti(true)
    let step = 0
    const interval = setInterval(() => {
      step++
      setCelebrationStep(step)
      if (step >= CELEBRATION_MESSAGES.length) clearInterval(interval)
    }, 600)
  }, [])

  if (forgiven) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center relative overflow-hidden"
      >
        {/* Confetti */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${seeded(i) * 100}%`,
                  top: -10,
                  width: 6 + seeded(i + 100) * 8,
                  height: 6 + seeded(i + 200) * 8,
                  backgroundColor: CONFETTI_COLORS[Math.floor(seeded(i + 300) * CONFETTI_COLORS.length)],
                  borderRadius: seeded(i + 400) > 0.5 ? "50%" : "2px",
                }}
                animate={{
                  y: [0, 500],
                  rotate: [0, 720],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + seeded(i + 500) * 3,
                  delay: i * 0.03,
                  ease: "easeIn",
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: primaryColor }}>
          MERCI !!!
        </h3>

        <div className="space-y-2 mb-6">
          {CELEBRATION_MESSAGES.slice(0, celebrationStep + 1).map((msg, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-700"
            >
              {msg}
            </motion.p>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-xs text-gray-500">
          <p>Tentatives : {attempt + 1}</p>
          <p>Statut : Pardonne(e) ✅</p>
          <p>Bonheur : 💯</p>
        </div>

        <p className="mt-4 text-sm font-medium" style={{ color: secondaryColor }}>
          — {senderName}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-5"
    >
      {/* Title */}
      <div className="text-center">
        <span className="text-3xl block mb-2">🥺</span>
        <p className="text-xs font-medium text-gray-400">
          Tentative #{attempt + 1}
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <StatBar label="Desespoir" value={desespoir} color="#ef4444" />
        <StatBar label="Supplication" value={supplication} color={primaryColor} />
        <StatBar label="Larmes" value={larmes} color="#3b82f6" />
        <StatBar label="Credibilite" value={credibilite} color="#22c55e" />
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={attempt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-50 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-gray-700 italic">&ldquo;{currentMessage}&rdquo;</p>
          <p className="text-xs mt-2 font-medium" style={{ color: secondaryColor }}>
            — {senderName}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Refusal feedback */}
      <AnimatePresence>
        {refusalText && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center text-red-500 bg-red-50 rounded-lg p-2"
          >
            {refusalText}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Milestone */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-center font-medium p-3 rounded-xl"
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            {milestone}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4">
        <motion.button
          onClick={handleNo}
          animate={{
            scale: noButtonScale,
            opacity: noButtonOpacity,
          }}
          whileTap={{ scale: noButtonScale * 0.95 }}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Non 😤
        </motion.button>

        <motion.button
          onClick={handleYes}
          animate={{ scale: yesButtonScale }}
          whileTap={{ scale: yesButtonScale * 0.95 }}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-medium shadow-lg transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          Oui, je pardonne 💕
        </motion.button>
      </div>
    </motion.div>
  )
}
