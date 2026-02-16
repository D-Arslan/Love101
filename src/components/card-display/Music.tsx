"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Music as MusicIcon, Pause, Play } from "lucide-react"

interface MusicProps {
  musicUrl?: string
  primaryColor: string
}

export function Music({ musicUrl, primaryColor }: MusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.4
    audio.loop = true

    function onEnded() { setIsPlaying(false) }
    function onError() { setHasError(true); setIsPlaying(false) }
    audio.addEventListener("ended", onEnded)
    audio.addEventListener("error", onError)
    return () => {
      audio.removeEventListener("ended", onEnded)
      audio.removeEventListener("error", onError)
    }
  }, [])

  if (!musicUrl || hasError) return null

  function toggle() {
    const audio = audioRef.current
    if (!audio) return

    if (!hasInteracted) setHasInteracted(true)

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setHasError(true))
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} preload="none" />

      <motion.button
        onClick={toggle}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
        style={{ backgroundColor: primaryColor }}
        aria-label={isPlaying ? "Pause musique" : "Jouer musique"}
      >
        {!hasInteracted ? (
          <MusicIcon className="h-5 w-5" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}

        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${primaryColor}` }}
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </>
  )
}
