import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { UserMenu } from "./UserMenu"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { Logo } from "./Logo"

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo size="sm" />
          <span className="font-serif text-lg font-bold text-gray-900">Love101</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <UserMenu email={user.email ?? ""} />
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-1.5" />
                Connexion
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
