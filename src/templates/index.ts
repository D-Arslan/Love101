import { valentine } from "./valentine"
import { apology } from "./apology"
import { loveLetter } from "./love-letter"
import { anniversary } from "./anniversary"
import { quizGame } from "./quiz-game"
import { rdv } from "./rdv"
import type { TemplateType } from "@/lib/constants"

export interface TemplateConfig {
  id: TemplateType
  name: string
  description: string
  defaultColors: {
    primary: string
    secondary: string
    background: string
    text: string
  }
  features: string[]
  placeholder: {
    message: string
    senderName: string
    recipientName: string
  }
}

export const templates: Record<TemplateType, TemplateConfig> = {
  valentine,
  apology,
  "love-letter": loveLetter,
  anniversary,
  "quiz-game": quizGame,
  rdv,
}

export const templateList = Object.values(templates)

export function getTemplate(type: TemplateType): TemplateConfig {
  return templates[type]
}
