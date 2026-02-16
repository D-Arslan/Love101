import { notFound } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from "next"
import crypto from "crypto"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getTemplate } from "@/templates"
import { CardRenderer } from "@/components/card-display/CardRenderer"
import type { Card } from "@/lib/types/database"
import type { TemplateType } from "@/lib/constants"

interface CardPageProps {
  params: Promise<{ id: string }>
}

async function getCard(id: string): Promise<Card | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  return data as Card | null
}

async function trackView(cardId: string) {
  try {
    const headersList = await headers()
    const forwarded = headersList.get("x-forwarded-for")
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown"
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex")
    const userAgent = headersList.get("user-agent") ?? null

    const admin = createAdminClient()
    await admin.from("card_views").insert({
      card_id: cardId,
      viewer_ip_hash: ipHash,
      user_agent: userAgent,
    })
  } catch {
    // View tracking is non-critical — don't break the page
  }
}

export async function generateMetadata({
  params,
}: CardPageProps): Promise<Metadata> {
  const { id } = await params
  const card = await getCard(id)

  if (!card) {
    return { title: "Message introuvable" }
  }

  const template = getTemplate(card.template_type as TemplateType)

  return {
    title: `${template.emoji} Un message pour ${card.recipient_name}`,
    description: `${card.sender_name} t'a envoyé un message spécial via Love101.`,
    openGraph: {
      title: `${template.emoji} Un message pour ${card.recipient_name}`,
      description: `${card.sender_name} t'a envoyé un message spécial.`,
      type: "website",
    },
  }
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params
  const card = await getCard(id)

  if (!card) {
    notFound()
  }

  // Track view (fire-and-forget, non-blocking)
  trackView(card.id)

  return <CardRenderer card={card} />
}
