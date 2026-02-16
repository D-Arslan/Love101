"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface ScratchProps {
  revealText: string
  primaryColor: string
}

export function Scratch({ revealText, primaryColor }: ScratchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
    if (transparent / total > 0.6) {
      setIsRevealed(true)
    }
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

    // Scratch hint text
    ctx.fillStyle = "rgba(255,255,255,0.3)"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Gratte ici ✨", canvas.width / 2, canvas.height / 2)
  }, [primaryColor])

  function getPos(e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null {
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
    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
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
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center"
      >
        <Sparkles className="h-6 w-6 mx-auto mb-3" style={{ color: primaryColor }} />
        <p className="text-lg font-medium text-gray-900">{revealText}</p>
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
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="h-4 w-4" style={{ color: primaryColor }} />
        <span className="text-sm font-medium text-gray-600">Gratte pour découvrir</span>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-32 rounded-xl overflow-hidden select-none touch-none"
      >
        {/* Hidden text behind canvas */}
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-50 rounded-xl">
          <p className="text-center font-medium text-gray-900">{revealText}</p>
        </div>

        {/* Scratch canvas */}
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
    </motion.div>
  )
}
