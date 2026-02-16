import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { createAdminClient } from "@/lib/supabase/admin"
import { createCardSchema } from "@/lib/validators/card"
import { CARD_ID_LENGTH } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const result = createCardSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const cardId = nanoid(CARD_ID_LENGTH)
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("cards")
      .insert({
        id: cardId,
        template_type: result.data.template_type,
        recipient_name: result.data.recipient_name,
        sender_name: result.data.sender_name,
        message: result.data.message,
        theme_colors: result.data.theme_colors,
        custom_config: result.data.custom_config || {},
        is_published: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Erreur lors de la création de la carte" },
        { status: 500 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    return NextResponse.json({
      card: data,
      shareUrl: `${appUrl}/l/${cardId}`,
    })
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
