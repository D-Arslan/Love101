import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Love101"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const subtitles: Record<string, string> = {
  fr: "Cree un message d'amour personnalise et fais craquer ton/ta partenaire",
  en: "Create a personalized love message and sweep your partner off their feet",
  es: "Crea un mensaje de amor personalizado y enamora a tu pareja",
}

export default async function OGImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const subtitle = subtitles[locale] ?? subtitles.fr

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
          background: "linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #f3e8ff 100%)",
          padding: "60px",
        }}
      >
        <div style={{ fontSize: 90, marginBottom: 24 }}>
          💌
        </div>

        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            background: "linear-gradient(to right, #e11d48, #9333ea)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Love101
        </div>

        <div
          style={{
            fontSize: 30,
            color: "#4b5563",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
            fontSize: 40,
          }}
        >
          <span>💝</span>
          <span>💌</span>
          <span>🥺</span>
          <span>🥂</span>
          <span>🧠</span>
          <span>📍</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
