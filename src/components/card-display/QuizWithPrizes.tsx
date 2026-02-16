"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, CheckCircle2, XCircle, Trophy, Gift, Sparkles } from "lucide-react"
import type { QuizQuestionData, QuizPrize } from "@/lib/types/database"

interface QuizWithPrizesProps {
  questions: QuizQuestionData[]
  prizes: QuizPrize[]
  primaryColor: string
  secondaryColor: string
}

function ScratchPrize({ prizeText, primaryColor }: { prizeText: string; primaryColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)

  const checkRevealProgress = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let transparent = 0
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++
    }
    const total = imageData.data.length / 4
    if (transparent / total > 0.5) setIsRevealed(true)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.fillStyle = primaryColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Gratte pour decouvrir ton prix ! 🎁", canvas.width / 2, canvas.height / 2)
  }, [primaryColor])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if ("touches" in e) {
      const touch = e.touches[0]
      if (!touch) return null
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function scratch(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const pos = getPos(e)
    if (!pos) return
    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2)
    ctx.fill()
  }

  function handleEnd() {
    setIsDrawing(false)
    checkRevealProgress()
  }

  if (isRevealed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 text-center border border-yellow-200"
      >
        <Sparkles className="h-6 w-6 mx-auto mb-2" style={{ color: primaryColor }} />
        <p className="text-lg font-bold text-gray-900 mb-1">🎉 Ton prix :</p>
        <p className="text-base font-medium" style={{ color: primaryColor }}>
          {prizeText}
        </p>
      </motion.div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-28 rounded-xl overflow-hidden select-none touch-none"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <Gift className="h-5 w-5 mb-1" style={{ color: primaryColor }} />
        <p className="text-center font-medium text-gray-900">{prizeText}</p>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-pointer rounded-xl"
        onMouseDown={(e) => { setIsDrawing(true); scratch(e) }}
        onMouseMove={scratch}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => { e.preventDefault(); setIsDrawing(true); scratch(e) }}
        onTouchMove={(e) => { e.preventDefault(); scratch(e) }}
        onTouchEnd={handleEnd}
      />
    </div>
  )
}

export function QuizWithPrizes({ questions, prizes, primaryColor, secondaryColor }: QuizWithPrizesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)

  const current = questions[currentIndex]

  function handleSelect(option: string) {
    if (selected) return
    setSelected(option)
    const isCorrect = option === current.correct_answer
    if (isCorrect) setScore((s) => s + 1)
    setShowResult(true)

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1)
        setSelected(null)
        setShowResult(false)
      } else {
        setFinished(true)
      }
    }, 1500)
  }

  function getScoreEmoji() {
    const pct = score / questions.length
    if (pct === 1) return "🥰"
    if (pct >= 0.6) return "😍"
    if (pct >= 0.4) return "😊"
    return "😅"
  }

  function getPrize(): string | null {
    const sorted = [...prizes].sort((a, b) => b.min_score - a.min_score)
    const match = sorted.find((p) => score >= p.min_score)
    return match?.text ?? null
  }

  if (finished) {
    const prizeText = getPrize()

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center space-y-4"
      >
        <Trophy className="h-8 w-8 mx-auto" style={{ color: primaryColor }} />
        <span className="text-4xl block">{getScoreEmoji()}</span>
        <p className="text-lg font-bold text-gray-900">
          {score}/{questions.length}
        </p>
        <p className="text-sm text-gray-500">
          {score === questions.length
            ? "Score parfait ! Tu me connais par coeur 💕"
            : score >= questions.length / 2
              ? "Pas mal ! Tu me connais bien 😘"
              : "On dirait qu'il faut mieux me connaitre 😏"}
        </p>

        {prizeText && (
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-600 mb-3">
              Ta recompense :
            </p>
            <ScratchPrize prizeText={prizeText} primaryColor={primaryColor} />
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" style={{ color: primaryColor }} />
          <span className="text-sm font-medium text-gray-600">Tu me connais ?</span>
        </div>
        <span className="text-xs text-gray-400">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-medium text-gray-900 mb-4 text-center">
            {current.question}
          </p>

          <div className="space-y-2">
            {current.options.map((option) => {
              const isSelected = selected === option
              const isCorrect = option === current.correct_answer
              let bg = "bg-gray-50 hover:bg-gray-100"
              let border = "border-gray-200"
              let icon = null

              if (showResult && isCorrect) {
                bg = "bg-green-50"
                border = "border-green-300"
                icon = <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              } else if (showResult && isSelected && !isCorrect) {
                bg = "bg-red-50"
                border = "border-red-300"
                icon = <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              }

              return (
                <motion.button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={!!selected}
                  whileTap={!selected ? { scale: 0.98 } : undefined}
                  className={`w-full text-left p-3 rounded-xl border ${border} ${bg} transition-colors text-sm flex items-center justify-between gap-2 disabled:cursor-default`}
                >
                  <span>{option}</span>
                  {icon}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: primaryColor }}
          animate={{ width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Prize hint */}
      {prizes.length > 0 && (
        <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center gap-1">
          <Gift className="h-3 w-3" />
          Un prix t&apos;attend selon ton score !
        </p>
      )}
    </motion.div>
  )
}
