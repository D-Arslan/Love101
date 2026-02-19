import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import { Navbar } from "@/components/shared/Navbar"
import { Providers } from "@/components/shared/Providers"
import { HtmlLangSetter } from "@/components/shared/HtmlLangSetter"
import { Toaster } from "@/components/ui/sonner"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <Providers>
      <NextIntlClientProvider>
        <HtmlLangSetter locale={locale} />
        <Navbar />
        {children}
        <Toaster />
      </NextIntlClientProvider>
    </Providers>
  )
}
