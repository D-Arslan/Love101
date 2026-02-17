"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, Clock, Palette } from "lucide-react"
import type { RdvDetails as RdvDetailsType } from "@/lib/types/database"

interface RdvDetailsProps {
  rdv: RdvDetailsType
  primaryColor: string
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function formatTime(timeStr: string): string {
  return timeStr
}

export function RdvDetails({ rdv, primaryColor }: RdvDetailsProps) {
  const items = [
    { icon: Calendar, label: "Date", value: formatDate(rdv.date) },
    { icon: Clock, label: "Heure", value: formatTime(rdv.time) },
    { icon: MapPin, label: "Lieu", value: rdv.location },
  ]

  if (rdv.theme) {
    items.push({ icon: Palette, label: "Theme", value: rdv.theme })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6"
    >
      <div className="flex items-center justify-center gap-2 mb-5">
        <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
        <span className="text-sm font-medium text-gray-600">
          Rendez-vous
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.4 }}
            className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <item.icon className="h-4 w-4" style={{ color: primaryColor }} />
            </div>
            <div>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
