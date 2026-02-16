import type { TemplateConfig } from "."

export const valentine: TemplateConfig = {
  id: "valentine",
  name: "Saint-Valentin",
  description: "Une invitation : Veux-tu etre ma valentine ?",
  emoji: "💝",
  defaultColors: {
    primary: "#e11d48",
    secondary: "#fda4af",
    background: "#fff1f2",
    text: "#1f2937",
  },
  features: ["envelope", "countdown", "music"],
  placeholder: {
    message:
      "Veux-tu etre ma valentine ? Je t'attends avec impatience pour passer la plus belle soiree ensemble...",
    senderName: "Ton valentin",
    recipientName: "Ma valentine",
  },
}
