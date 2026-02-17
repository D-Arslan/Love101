import { describe, it, expect } from "vitest"
import { createCardSchema } from "@/lib/validators/card"

const validCard = {
  template_type: "valentine" as const,
  recipient_name: "Marie",
  sender_name: "Pierre",
  message: "Je t'aime",
  theme_colors: {
    primary: "#e11d48",
    secondary: "#fda4af",
    background: "#fff1f2",
    text: "#1f2937",
  },
}

describe("createCardSchema", () => {
  it("should accept a valid card", () => {
    const result = createCardSchema.safeParse(validCard)
    expect(result.success).toBe(true)
  })

  it("should reject empty recipient name", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      recipient_name: "",
    })
    expect(result.success).toBe(false)
  })

  it("should reject empty sender name", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      sender_name: "",
    })
    expect(result.success).toBe(false)
  })

  it("should reject empty message", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      message: "",
    })
    expect(result.success).toBe(false)
  })

  it("should reject name longer than 50 chars", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      recipient_name: "a".repeat(51),
    })
    expect(result.success).toBe(false)
  })

  it("should reject message longer than 2000 chars", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      message: "a".repeat(2001),
    })
    expect(result.success).toBe(false)
  })

  it("should reject invalid template type", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      template_type: "invalid",
    })
    expect(result.success).toBe(false)
  })

  it("should reject invalid color format", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      theme_colors: { ...validCard.theme_colors, primary: "red" },
    })
    expect(result.success).toBe(false)
  })

  it("should accept valid custom config with quiz", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      custom_config: {
        quiz: [
          {
            question: "Quelle est ma couleur preferee ?",
            options: ["Rouge", "Bleu", "Vert", "Jaune"],
            correct_answer: "Rouge",
          },
        ],
      },
    })
    expect(result.success).toBe(true)
  })

  it("should reject quiz with less than 4 options", () => {
    const result = createCardSchema.safeParse({
      ...validCard,
      custom_config: {
        quiz: [
          {
            question: "Test?",
            options: ["A", "B"],
            correct_answer: "A",
          },
        ],
      },
    })
    expect(result.success).toBe(false)
  })

  it("should accept card without custom config", () => {
    const result = createCardSchema.safeParse(validCard)
    expect(result.success).toBe(true)
  })
})
