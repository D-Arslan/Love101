import type { TemplateConfig } from "."

export const quizGame: TemplateConfig = {
  id: "quiz-game",
  name: "Tu me connais ?",
  description: "Un quiz sur ton couple avec des prix a gratter selon le score",
  emoji: "🧠",
  defaultColors: {
    primary: "#2563eb",
    secondary: "#93c5fd",
    background: "#eff6ff",
    text: "#1f2937",
  },
  features: ["envelope", "quiz", "quiz-prizes", "music"],
  placeholder: {
    message:
      "Tu penses bien me connaitre ? Prouve-le ! Reponds a ces questions et decouvre ta recompense...",
    senderName: "Ton/Ta cheri(e)",
    recipientName: "Mon coeur",
  },
}
