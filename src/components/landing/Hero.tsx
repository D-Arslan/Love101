"use client"

import { motion } from "framer-motion"
import { Heart, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const floatingHearts = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 6,
  size: 14 + Math.random() * 18,
}))

export function Hero() {
  function scrollToTemplates() {
    document
      .getElementById("templates")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-rose-200"
            style={{ left: `${heart.x}%`, fontSize: heart.size }}
            animate={{
              y: [
                typeof window !== "undefined" ? window.innerHeight : 800,
                -50,
              ],
              opacity: [0, 0.4, 0.4, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Heart fill="currentColor" size={heart.size} />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-6xl">💌</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6"
        >
          Cree un message{" "}
          <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            inoubliable
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto"
        >
          Saint-Valentin, excuses, mots doux, anniversaire...
          Personnalise, partage un lien, et fais craquer ton/ta partenaire.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            onClick={scrollToTemplates}
            size="lg"
            className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Commencer
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
