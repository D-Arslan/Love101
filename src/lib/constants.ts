export const CARD_ID_LENGTH = 10
export const MAX_MESSAGE_LENGTH = 2000
export const MAX_NAME_LENGTH = 50
export const MAX_QUIZ_QUESTIONS = 5

export const TEMPLATE_TYPES = [
  "valentine",
  "apology",
  "love-letter",
  "anniversary",
] as const

export type TemplateType = (typeof TEMPLATE_TYPES)[number]
