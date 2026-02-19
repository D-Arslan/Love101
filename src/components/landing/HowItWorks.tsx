"use client"

import { motion } from "framer-motion"
import { MousePointerClick, Palette, Share2 } from "lucide-react"
import { useTranslations } from "next-intl"

const stepIcons = [MousePointerClick, Palette, Share2]
const stepColors = [
  { color: "text-rose-500", bg: "bg-rose-50" },
  { color: "text-purple-500", bg: "bg-purple-50" },
  { color: "text-pink-500", bg: "bg-pink-50" },
]
const stepKeys = ["step1", "step2", "step3"] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function HowItWorks() {
  const t = useTranslations("landing.howItWorks")

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            {t("title")}
          </h2>
          <p className="mt-3 text-gray-500">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {stepKeys.map((key, index) => {
            const Icon = stepIcons[index]
            const { color, bg } = stepColors[index]
            return (
              <motion.div
                key={key}
                variants={itemVariants}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${bg} ${color} mb-4`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="text-xs font-semibold text-gray-400 mb-1">
                  {index + 1}.
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {t(`${key}Title`)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(`${key}Description`)}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
