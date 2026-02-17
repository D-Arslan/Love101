import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { createCardSchema } from "@/lib/validators/card"
import { CARD_ID_LENGTH } from "@/lib/constants"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    // 10 cards per minute per IP
    const limited = await rateLimit({ maxRequests: 10, windowMs: 60_000 })
    if (limited) return limited

    const body = await request.json()

    const result = createCardSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    // Capture user_id if authenticated (anonymous creation still allowed)
    const supabaseAuth = await createClient()
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser()

    const cardId = nanoid(CARD_ID_LENGTH)
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from("cards")
      .insert({
        id: cardId,
        user_id: user?.id ?? null,
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
