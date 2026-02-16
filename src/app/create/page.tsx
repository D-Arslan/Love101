import { redirect } from "next/navigation"
import { TEMPLATE_TYPES, type TemplateType } from "@/lib/constants"
import { CreateForm } from "@/components/create/CreateForm"

interface CreatePageProps {
  searchParams: Promise<{ template?: string }>
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const params = await searchParams
  const templateType = params.template as TemplateType

  if (!templateType || !TEMPLATE_TYPES.includes(templateType)) {
    redirect("/")
  }

  return <CreateForm templateType={templateType} />
}
