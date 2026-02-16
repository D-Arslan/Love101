import type { TemplateType } from "@/lib/constants"

export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  text: string
}

export interface QuizQuestionData {
  question: string
  options: string[]
  correct_answer: string
}

export interface QuizPrize {
  min_score: number
  text: string
}

export interface RdvDetails {
  date: string
  time: string
  location: string
  theme?: string
}

export interface CustomConfig {
  countdown_date?: string
  countdown_direction?: "down" | "up"
  reasons?: string[]
  promises?: string[]
  quiz?: QuizQuestionData[]
  quiz_prizes?: QuizPrize[]
  scratch_text?: string
  music_enabled?: boolean
  music_url?: string
  rdv?: RdvDetails
  rdv_clues?: string[]
  memories?: string[]
  // Sorry algorithm custom messages
  sorry_messages?: string[]
  sorry_refusals?: string[]
}

export interface Card {
  id: string
  user_id: string | null
  template_type: TemplateType
  recipient_name: string
  sender_name: string
  message: string
  theme_colors: ThemeColors
  custom_config: CustomConfig
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

export interface CreateCardInput {
  template_type: TemplateType
  recipient_name: string
  sender_name: string
  message: string
  theme_colors: ThemeColors
  custom_config?: CustomConfig
}
