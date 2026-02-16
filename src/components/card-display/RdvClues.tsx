"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Eye } from "lucide-react"

interface RdvCluesProps {
  clues: string[]
  primaryColor: string
  secondaryColor: string
}

export function RdvClues({ clues, primaryColor, secondaryColor }: RdvCluesProps) {
  const [revealedCount, setRevealedCount] = useState(0)

  function revealNext() {
    if (revealedCount < clues.length) {
      setRevealedCount((c) => c + 1)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6"
    >
      <div className="flex items-center justify-center gap-2 mb-5">
        <Search className="h-4 w-4" style={{ color: primaryColor }} />
        <span className="text-sm font-medium text-gray-600">
          Indices ({revealedCount}/{clues.length})
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {clues.map((clue, i) => (
          <AnimatePresence key={i}>
            {i < revealedCount ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
              >
                <span
                  className="text-xs font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 pt-0.5">{clue}</p>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-xs font-bold shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-400">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-300">???</p>
              </div>
            )}
          </AnimatePresence>
        ))}
      </div>

      {revealedCount < clues.length && (
        <motion.button
          onClick={revealNext}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2.5 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          <Eye className="h-4 w-4" />
          Reveler l&apos;indice #{revealedCount + 1}
        </motion.button>
      )}

      {revealedCount === clues.length && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm"
          style={{ color: secondaryColor }}
        >
          Tous les indices sont reveles ! A toi de jouer 😏
        </motion.p>
      )}
    </motion.div>
  )
}
