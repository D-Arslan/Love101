import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Navbar } from "@/components/shared/Navbar"
import { Providers } from "@/components/shared/Providers"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Love101 — Cree un message d'amour personnalise",
    template: "%s | Love101",
  },
  description:
    "Cree et partage des messages d'amour personnalises : Saint-Valentin, excuses, mots doux, anniversaire. Un lien unique, une surprise inoubliable.",
  manifest: "/manifest.json",
  themeColor: "#e11d48",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Love101",
  },
  openGraph: {
    title: "Love101 — Cree un message d'amour personnalise",
    description:
      "Un lien unique, une surprise inoubliable. Cree ton message personnalise.",
    type: "website",
    locale: "fr_FR",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
