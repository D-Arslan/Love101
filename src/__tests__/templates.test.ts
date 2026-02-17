import { describe, it, expect } from "vitest"
import { templates, templateList, getTemplate } from "@/templates"
import { TEMPLATE_TYPES } from "@/lib/constants"

describe("Templates", () => {
  it("should have a config for every template type", () => {
    for (const type of TEMPLATE_TYPES) {
      expect(templates[type]).toBeDefined()
      expect(templates[type].id).toBe(type)
    }
  })

  it("templateList should contain all templates", () => {
    expect(templateList).toHaveLength(TEMPLATE_TYPES.length)
  })

  it("getTemplate should return correct template", () => {
    const valentine = getTemplate("valentine")
    expect(valentine.id).toBe("valentine")
    expect(valentine.name).toBeTruthy()
    expect(valentine.emoji).toBeTruthy()
  })

  it("every template should have required fields", () => {
    for (const template of templateList) {
      expect(template.id).toBeTruthy()
      expect(template.name).toBeTruthy()
      expect(template.description).toBeTruthy()
      expect(template.emoji).toBeTruthy()
      expect(template.defaultColors).toBeDefined()
      expect(template.defaultColors.primary).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(template.defaultColors.secondary).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(template.defaultColors.background).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(template.defaultColors.text).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(template.features).toBeInstanceOf(Array)
      expect(template.placeholder).toBeDefined()
      expect(template.placeholder.message).toBeTruthy()
      expect(template.placeholder.senderName).toBeTruthy()
      expect(template.placeholder.recipientName).toBeTruthy()
    }
  })

  it("every template should have envelope feature", () => {
    for (const template of templateList) {
      expect(template.features).toContain("envelope")
    }
  })
})
