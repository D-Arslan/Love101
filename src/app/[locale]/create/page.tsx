import { redirect } from "next/navigation"
import { TEMPLATE_TYPES, type TemplateType } from "@/lib/constants"
import { CreateForm } from "@/components/create/CreateForm"
import { setRequestLocale } from "next-intl/server"

interface CreatePageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ template?: string }>
}

export default async function CreatePage({ params, searchParams }: CreatePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const sp = await searchParams
  const templateType = sp.template as TemplateType

  if (!templateType || !TEMPLATE_TYPES.includes(templateType)) {
    redirect(`/${locale}`)
  }

  return <CreateForm templateType={templateType} />
}
