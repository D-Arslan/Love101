import type { TemplateConfig } from "."

export const apology: TemplateConfig = {
  id: "apology",
  name: "Demande de pardon",
  description: "Un algorithme de supplication interactif et irresistible",
  defaultColors: {
    primary: "#7c3aed",
    secondary: "#c4b5fd",
    background: "#f5f3ff",
    text: "#1f2937",
  },
  features: ["envelope", "sorry-algorithm", "promises", "scratch", "music"],
  placeholder: {
    message:
      "Je sais que j'ai fait une erreur et je m'en veux. Tu comptes enormement pour moi et je ferai tout pour me rattraper...",
    senderName: "Celui/celle qui regrette",
    recipientName: "Toi que j'ai blesse(e)",
  },
}
