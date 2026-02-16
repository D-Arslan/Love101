"use client"

import {
  Heart,
  HeartHandshake,
  PenLine,
  PartyPopper,
  Brain,
  MapPin,
} from "lucide-react"
import type { LucideProps } from "lucide-react"
import type { TemplateType } from "@/lib/constants"

const ICON_MAP: Record<
  TemplateType,
  { icon: React.ComponentType<LucideProps>; color: string }
> = {
  valentine: { icon: Heart, color: "#e11d48" },
  apology: { icon: HeartHandshake, color: "#7c3aed" },
  "love-letter": { icon: PenLine, color: "#db2777" },
  anniversary: { icon: PartyPopper, color: "#d97706" },
  "quiz-game": { icon: Brain, color: "#2563eb" },
  rdv: { icon: MapPin, color: "#059669" },
}

interface TemplateIconProps {
  type: TemplateType
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const SIZES = {
  sm: { container: "w-8 h-8", icon: "h-4 w-4" },
  md: { container: "w-12 h-12", icon: "h-6 w-6" },
  lg: { container: "w-16 h-16", icon: "h-8 w-8" },
  xl: { container: "w-20 h-20", icon: "h-10 w-10" },
}

export function TemplateIcon({ type, size = "md", className = "" }: TemplateIconProps) {
  const config = ICON_MAP[type]
  if (!config) return null

  const Icon = config.icon
  const s = SIZES[size]

  return (
    <div
      className={`${s.container} rounded-2xl flex items-center justify-center ${className}`}
      style={{ backgroundColor: `${config.color}15` }}
    >
      <Icon className={s.icon} style={{ color: config.color }} />
    </div>
  )
}
