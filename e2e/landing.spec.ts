import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  test("should display hero section with title", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toContainText("inoubliable")
  })

  test("should display all 6 templates", async ({ page }) => {
    await page.goto("/")
    const templateCards = page.locator("#templates").locator("[class*='cursor-pointer']")
    await expect(templateCards).toHaveCount(6)
  })

  test("should navigate to create page when template is clicked", async ({ page }) => {
    await page.goto("/")
    // Click first template card
    const firstTemplate = page.locator("#templates").locator("[class*='cursor-pointer']").first()
    await firstTemplate.click()
    await expect(page).toHaveURL(/\/create\?template=/)
  })

  test("should show navbar with Love101 branding", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("nav")).toContainText("Love101")
  })

  test("should show footer", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("footer")).toContainText("Love101")
  })
})

test.describe("Create page", () => {
  test("should load with template pre-selected", async ({ page }) => {
    await page.goto("/create?template=valentine")
    await expect(page.locator("h1")).toContainText("message")
  })

  test("should show form fields", async ({ page }) => {
    await page.goto("/create?template=valentine")
    await expect(page.locator("input[name='recipient_name'], input[placeholder*='destinataire'], label:has-text('destinataire')").first()).toBeVisible()
  })
})

test.describe("Auth pages", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.locator("button[type='submit'], button:has-text('Connexion'), button:has-text('connexion')").first()).toBeVisible()
  })

  test("should display signup form", async ({ page }) => {
    await page.goto("/auth/signup")
    await expect(page.locator("button[type='submit'], button:has-text('Inscription'), button:has-text('inscription'), button:has-text('Creer')").first()).toBeVisible()
  })

  test("should have link to switch between login and signup", async ({ page }) => {
    await page.goto("/auth/login")
    await expect(page.locator("a[href*='signup']")).toBeVisible()
  })
})
