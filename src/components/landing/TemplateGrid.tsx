"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { templateList } from "@/templates"
import { Sparkles } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const FEATURE_LABELS: Record<string, string> = {
  envelope: "Enveloppe",
  countdown: "Compte a rebours",
  reasons: "Pourquoi je t'aime",
  promises: "Mes promesses",
  memories: "Nos souvenirs",
  quiz: "Quiz",
  "quiz-prizes": "Prix a gratter",
  scratch: "Message cache",
  music: "Musique",
  "sorry-algorithm": "L'Algorithme du pardon",
  "rdv-details": "Rendez-vous",
  "rdv-clues": "Indices",
}

export function TemplateGrid() {
  return (
    <section id="templates" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Choisis ton template
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            Quelle occasion ?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {templateList.map((template) => (
            <motion.div key={template.id} variants={cardVariants}>
              <Link href={`/create?template=${template.id}`}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative rounded-2xl border border-gray-100 p-6 bg-white shadow-sm hover:shadow-xl transition-shadow cursor-pointer h-full"
                  style={{
                    borderTopColor: template.defaultColors.primary,
                    borderTopWidth: "3px",
                  }}
                >
                  <div className="text-5xl mb-4">{template.emoji}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {template.features
                      .filter((f) => f !== "envelope" && f !== "music")
                      .slice(0, 3)
                      .map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"
                        >
                          {FEATURE_LABELS[feature] || feature}
                        </span>
                      ))}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `linear-gradient(90deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary})`,
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
