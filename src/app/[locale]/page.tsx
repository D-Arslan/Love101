import { setRequestLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { TemplateGrid } from "@/components/landing/TemplateGrid"
import { Footer } from "@/components/landing/Footer"

interface HomeProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.home" })

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
    },
  }
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main>
      <Hero />
      <HowItWorks />
      <TemplateGrid />
      <Footer />
    </main>
  )
}
