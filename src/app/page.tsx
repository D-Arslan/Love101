import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { TemplateGrid } from "@/components/landing/TemplateGrid"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <TemplateGrid />
      <Footer />
    </main>
  )
}
