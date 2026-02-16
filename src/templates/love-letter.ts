import type { TemplateConfig } from "."

export const loveLetter: TemplateConfig = {
  id: "love-letter",
  name: "Mots d'amour",
  description: "Une lettre d'amour pour exprimer tes sentiments",
  emoji: "💌",
  defaultColors: {
    primary: "#db2777",
    secondary: "#f9a8d4",
    background: "#fdf2f8",
    text: "#1f2937",
  },
  features: ["envelope", "reasons", "countdown", "music"],
  placeholder: {
    message:
      "Chaque jour a tes cotes est un cadeau. Tu illumines ma vie d'une maniere que les mots ne peuvent decrire...",
    senderName: "Avec tout mon amour",
    recipientName: "Mon tresor",
  },
}
