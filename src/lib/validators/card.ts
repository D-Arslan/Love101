import { z } from "zod"
import {
  MAX_MESSAGE_LENGTH,
  MAX_NAME_LENGTH,
  TEMPLATE_TYPES,
} from "@/lib/constants"

const themeColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  background: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
  text: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur invalide"),
})

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
})

export type CreateCardSchema = z.infer<typeof createCardSchema>
