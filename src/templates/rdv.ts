import type { TemplateConfig } from "."

export const rdv: TemplateConfig = {
  id: "rdv",
  name: "Rendez-vous",
  description: "Donne un rendez-vous mysterieux avec des indices",
  emoji: "📍",
  defaultColors: {
    primary: "#059669",
    secondary: "#6ee7b7",
    background: "#ecfdf5",
    text: "#1f2937",
  },
  features: ["envelope", "rdv-details", "rdv-clues", "countdown", "music"],
  placeholder: {
    message:
      "J'ai une surprise pour toi... Suis les indices et retrouve-moi au rendez-vous !",
    senderName: "Ton/Ta mysterieux(se)",
    recipientName: "Mon aventurier(e)",
  },
}
