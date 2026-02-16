"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface CountdownProps {
  targetDate: string
  primaryColor: string
  secondaryColor: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(target: Date): TimeLeft & { isPast: boolean } {
  const now = new Date().getTime()
  const diff = target.getTime() - now
  const isPast = diff < 0
  const absDiff = Math.abs(diff)

  return {
    isPast,
    days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((absDiff / (1000 * 60)) % 60),
    seconds: Math.floor((absDiff / 1000) % 60),
  }
}

function TimeUnit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg"
        style={{ backgroundColor: color }}
      >
        {String(value).padStart(2, "0")}
      </motion.div>
      <span className="text-xs mt-1.5 text-gray-500 font-medium">{label}</span>
    </div>
  )
}

export function Countdown({ targetDate, primaryColor, secondaryColor }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft & { isPast: boolean }>(() =>
    calculateTimeLeft(new Date(targetDate))
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(new Date(targetDate)))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock className="h-4 w-4" style={{ color: primaryColor }} />
        <span className="text-sm font-medium text-gray-600">
          {timeLeft.isPast ? "Depuis" : "Dans"}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="jours" color={primaryColor} />
        <span className="text-xl font-bold text-gray-300 mt-[-20px]">:</span>
        <TimeUnit value={timeLeft.hours} label="heures" color={secondaryColor} />
        <span className="text-xl font-bold text-gray-300 mt-[-20px]">:</span>
        <TimeUnit value={timeLeft.minutes} label="min" color={primaryColor} />
        <span className="text-xl font-bold text-gray-300 mt-[-20px]">:</span>
        <TimeUnit value={timeLeft.seconds} label="sec" color={secondaryColor} />
      </div>
    </motion.div>
  )
}
