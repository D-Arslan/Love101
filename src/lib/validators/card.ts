import { z } from "zod"
import {
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  MAX_QUIZ_QUESTIONS,
  MAX_REASONS,
  MAX_PROMISES,
  MAX_RDV_CLUES,
  TEMPLATE_TYPES,
} from "@/lib/constants"

const themeColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  text: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
})

const quizQuestionSchema = z.object({
  question: z.string().min(1).max(200),
  options: z.array(z.string().min(1).max(100)).length(4),
  correct_answer: z.string().min(1).max(100),
})

const quizPrizeSchema = z.object({
  min_score: z.number().int().min(0),
  text: z.string().min(1).max(200),
})

const rdvDetailsSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1).max(200),
  theme: z.string().max(200).optional(),
})

const customConfigSchema = z
  .object({
    countdown_date: z.string().optional(),
    countdown_direction: z.enum(["down", "up"]).optional(),
    reasons: z.array(z.string().min(1).max(200)).max(MAX_REASONS).optional(),
    promises: z.array(z.string().min(1).max(200)).max(MAX_PROMISES).optional(),
    quiz: z.array(quizQuestionSchema).max(MAX_QUIZ_QUESTIONS).optional(),
    quiz_prizes: z.array(quizPrizeSchema).max(MAX_QUIZ_QUESTIONS).optional(),
    scratch_text: z.string().max(200).optional(),
    music_enabled: z.boolean().optional(),
    music_url: z.string().url().optional(),
    rdv: rdvDetailsSchema.optional(),
    rdv_clues: z.array(z.string().min(1).max(200)).max(MAX_RDV_CLUES).optional(),
    memories: z.array(z.string().min(1).max(200)).max(MAX_REASONS).optional(),
    sorry_messages: z.array(z.string().min(1).max(300)).max(20).optional(),
    sorry_refusals: z.array(z.string().min(1).max(300)).max(13).optional(),
  })
  .optional()

export const createCardSchema = z.object({
  template_type: z.enum(TEMPLATE_TYPES),
  recipient_name: z
    .string()
    .min(1, "Le nom du destinataire est requis")
    .max(MAX_NAME_LENGTH, `Maximum ${MAX_NAME_LENGTH} caractères`),
  sender_name: z
    .string()
    .min(1, "Ton nom est requis")
    .max(MAX_NAME_LENGTH, `Maximum ${MAX_NAME_LENGTH} caractères`),
  message: z
    .string()
    .min(1, "Le message est requis")
    .max(MAX_MESSAGE_LENGTH, `Maximum ${MAX_MESSAGE_LENGTH} caractères`),
  theme_colors: themeColorsSchema,
  custom_config: customConfigSchema,
})

export type CreateCardSchema = z.infer<typeof createCardSchema>
