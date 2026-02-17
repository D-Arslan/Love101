import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"
import { getTemplate } from "@/templates"
import type { Card } from "@/lib/types/database"
import type { TemplateType } from "@/lib/constants"

export const runtime = "edge"
export const alt = "Love101 — Un message pour toi"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await getCard(id)

  if (!card) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff1f2",
            fontSize: 48,
            color: "#e11d48",
          }}
        >
          Message introuvable
        </div>
      ),
      { ...size }
    )
  }

  const template = getTemplate(card.template_type as TemplateType)
  const colors = card.theme_colors ?? template.defaultColors

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colors.background} 0%, white 100%)`,
          padding: "60px",
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: 80, marginBottom: 20 }}>
          {template.emoji}
        </div>

        {/* Recipient */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: colors.primary,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          {card.recipient_name}
        </div>

        {/* Message */}
        <div
          style={{
            fontSize: 28,
            color: colors.text,
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
            opacity: 0.8,
          }}
        >
          Tu as recu un message special...
        </div>

        {/* Sender */}
        <div
          style={{
            fontSize: 24,
            color: colors.primary,
            marginTop: 30,
            opacity: 0.7,
          }}
        >
          De la part de {card.sender_name}
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 22,
            color: "#9ca3af",
          }}
        >
          Love101
        </div>
      </div>
    ),
    { ...size }
  )
}
