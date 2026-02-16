"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ThemeColors } from "@/lib/types/database"

interface EnvelopeProps {
  colors: ThemeColors
  recipientName: string
  emoji: string
  onOpen: () => void
}

export function Envelope({ colors, recipientName, emoji, onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false)

  function handleOpen() {
    setIsOpening(true)
    setTimeout(onOpen, 1200)
  }

  return (
    <AnimatePresence>
      {!isOpening ? (
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center p-4 cursor-pointer"
          style={{ backgroundColor: colors.background }}
          onClick={handleOpen}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Envelope body */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-72 h-48 sm:w-96 sm:h-64"
          >
            {/* Envelope back */}
            <div
              className="absolute inset-0 rounded-xl shadow-2xl"
              style={{ backgroundColor: colors.primary }}
            />

            {/* Envelope flap (triangle) */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 origin-top"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: colors.secondary,
                opacity: 0.8,
              }}
            />

            {/* Envelope front */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[60%] rounded-b-xl"
              style={{ backgroundColor: colors.primary }}
            />

            {/* Heart seal */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl z-10"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {emoji}
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p
              className="font-serif text-xl sm:text-2xl font-bold mb-2"
              style={{ color: colors.primary }}
            >
              Pour {recipientName}
            </p>
            <motion.p
              className="text-sm"
              style={{ color: colors.text, opacity: 0.6 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Appuie pour ouvrir
            </motion.p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: colors.background }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Opening animation */}
          <motion.div className="relative w-72 h-48 sm:w-96 sm:h-64">
            <div
              className="absolute inset-0 rounded-xl shadow-2xl"
              style={{ backgroundColor: colors.primary }}
            />
            {/* Flap opening */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 origin-top"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backgroundColor: colors.secondary,
                opacity: 0.8,
              }}
              animate={{ rotateX: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            {/* Card sliding up */}
            <motion.div
              className="absolute inset-2 rounded-lg bg-white flex items-center justify-center"
              animate={{ y: -100, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <span className="text-3xl">{emoji}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
