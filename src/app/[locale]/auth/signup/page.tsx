import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SignupForm } from "@/components/auth/SignupForm"
import { setRequestLocale, getTranslations } from "next-intl/server"
import type { Metadata } from "next"

interface SignupPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: SignupPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.signup" })
  return { title: t("title") }
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <SignupForm />
    </div>
  )
}
