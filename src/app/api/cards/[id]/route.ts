import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 })
    }

    const admin = createAdminClient()

    const { data: card } = await admin
      .from("cards")
      .select("id, user_id")
      .eq("id", id)
      .single()

    if (!card) {
      return NextResponse.json({ error: "Carte introuvable" }, { status: 404 })
    }

    if (card.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 })
    }

    await admin.from("card_views").delete().eq("card_id", id)
    const { error } = await admin.from("cards").delete().eq("id", id)

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json(
        { error: "Erreur lors de la suppression" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
