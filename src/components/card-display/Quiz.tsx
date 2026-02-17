"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, CheckCircle2, XCircle, Trophy } from "lucide-react"

interface QuizQuestionData {
  question: string
  options: string[]
  correct_answer: string
}

interface QuizProps {
  questions: QuizQuestionData[]
  primaryColor: string
}

export function Quiz({ questions, primaryColor }: QuizProps) {
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

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center"
      >
        <Trophy className="h-8 w-8 mx-auto mb-3" style={{ color: primaryColor }} />
        <span className="text-4xl block mb-3">{getScoreEmoji()}</span>
        <p className="text-lg font-bold text-gray-900 mb-1">
          {score}/{questions.length}
        </p>
        <p className="text-sm text-gray-500">
          {score === questions.length
            ? "Score parfait ! Tu me connais par cœur 💕"
            : score >= questions.length / 2
              ? "Pas mal ! Tu me connais bien 😘"
              : "On dirait qu'il faut mieux me connaître 😏"}
        </p>
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
          <span className="text-sm font-medium text-gray-600">Quiz</span>
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
    </motion.div>
  )
}
