import type { TemplateConfig } from "."

export const anniversary: TemplateConfig = {
  id: "anniversary",
  name: "Anniversaire",
  description: "Nos meilleurs souvenirs, un quiz et un compteur de jours ensemble",
  emoji: "🥂",
  defaultColors: {
    primary: "#d97706",
    secondary: "#fcd34d",
    background: "#fffbeb",
    text: "#1f2937",
  },
  features: ["envelope", "countdown", "memories", "quiz", "music"],
  placeholder: {
    message:
      "X ans/mois ensemble et chaque jour je t'aime un peu plus. Merci d'etre la personne extraordinaire que tu es...",
    senderName: "Ta moitie",
    recipientName: "Mon/Ma partenaire",
  },
}
