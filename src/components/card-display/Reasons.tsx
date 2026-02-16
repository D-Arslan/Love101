"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"

interface ReasonsProps {
  reasons: string[]
  primaryColor: string
  secondaryColor: string
}

export function Reasons({ reasons, primaryColor, secondaryColor }: ReasonsProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  function next() {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % reasons.length)
  }

  function prev() {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + reasons.length) % reasons.length)
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6"
    >
      <div className="flex items-center justify-center gap-2 mb-5">
        <Heart className="h-4 w-4" style={{ color: primaryColor }} fill={primaryColor} />
        <span className="text-sm font-medium text-gray-600">
          {reasons.length} raisons pour lesquelles je t&apos;aime
        </span>
      </div>

      <div className="relative overflow-hidden min-h-[120px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="text-center px-8"
          >
            <span
              className="text-3xl font-bold block mb-3"
              style={{ color: primaryColor }}
            >
              #{current + 1}
            </span>
            <p className="text-gray-700 leading-relaxed">
              {reasons[current]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-5">
        <button
          onClick={prev}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ color: primaryColor }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-1.5">
          {reasons.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i === current ? primaryColor : "#e5e7eb",
                transform: i === current ? "scale(1.3)" : "scale(1)",
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
          style={{ color: primaryColor }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )
}
