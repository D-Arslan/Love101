import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createReviewSchema } from "@/lib/validators/review"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    // 5 reviews per minute per IP
    const limited = await rateLimit({ maxRequests: 5, windowMs: 60_000 })
    if (limited) return limited

    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()

    const result = createReviewSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    // Upsert: one review per user
    const { data, error } = await admin
      .from("reviews")
      .upsert(
        {
          user_id: user.id,
          author_name: result.data.author_name,
          rating: result.data.rating,
          comment: result.data.comment,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de la création de l'avis" },
        { status: 500 }
      )
    }

    // Revalidate reviews pages for all locales
    revalidatePath("/[locale]/reviews", "page")

    return NextResponse.json({ review: data })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
