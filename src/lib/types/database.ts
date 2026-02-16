import type { TemplateType } from "@/lib/constants"

export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  text: string
}

export interface Card {
  id: string
  user_id: string | null
  template_type: TemplateType
  recipient_name: string
  sender_name: string
  message: string
  theme_colors: ThemeColors
  custom_config: Record<string, unknown>
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CardView {
  id: string
  card_id: string
  viewed_at: string
  viewer_ip_hash: string | null
  user_agent: string | null
}

export interface QuizQuestion {
  id: string
  card_id: string
  question: string
  correct_answer: string
  options: string[]
  sort_order: number
}

export interface CreateCardInput {
  template_type: TemplateType
  recipient_name: string
  sender_name: string
  message: string
  theme_colors: ThemeColors
}
