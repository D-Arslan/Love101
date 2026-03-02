import { z } from "zod"
import { MAX_REVIEW_COMMENT_LENGTH, MAX_NAME_LENGTH } from "@/lib/constants"

export const createReviewSchema = z.object({
  author_name: z
    .string()
    .min(1, "Le nom est requis")
    .max(MAX_NAME_LENGTH, `Maximum ${MAX_NAME_LENGTH} caractères`),
  rating: z
    .number()
    .int()
    .min(1, "Note minimale : 1")
    .max(5, "Note maximale : 5"),
  comment: z
    .string()
    .min(1, "Le commentaire est requis")
    .max(MAX_REVIEW_COMMENT_LENGTH, `Maximum ${MAX_REVIEW_COMMENT_LENGTH} caractères`),
})

export type CreateReviewSchema = z.infer<typeof createReviewSchema>
