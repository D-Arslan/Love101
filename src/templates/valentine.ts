import type { TemplateConfig } from "."

export const valentine: TemplateConfig = {
  id: "valentine",
  name: "Saint-Valentin",
  description: "Une invitation romantique pour la fete des amoureux",
  emoji: "💝",
  defaultColors: {
    primary: "#e11d48",
    secondary: "#fda4af",
    background: "#fff1f2",
    text: "#1f2937",
  },
  features: ["envelope", "countdown", "reasons", "music"],
  placeholder: {
    message:
      "Mon coeur bat plus fort a chaque instant passe avec toi. Tu es la plus belle chose qui me soit arrivee...",
    senderName: "Ton amoureux",
    recipientName: "Mon amour",
  },
}
