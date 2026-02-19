import { Providers } from "@/components/shared/Providers"
import { Toaster } from "@/components/ui/sonner"

export default function SharedLinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      {children}
      <Toaster />
    </Providers>
  )
}
