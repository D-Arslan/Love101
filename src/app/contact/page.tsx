import type { Metadata } from "next"
import { Mail, MessageSquare, Bug } from "lucide-react"
import { Logo } from "@/components/shared/Logo"

export const metadata: Metadata = {
  title: "Contact",
}

const CONTACT_EMAIL = "contact@love101.app"

const reasons = [
  {
    icon: MessageSquare,
    title: "Question generale",
    description: "Une question sur Love101 ou son fonctionnement",
  },
  {
    icon: Bug,
    title: "Signaler un bug",
    description: "Quelque chose ne fonctionne pas comme prevu",
  },
  {
    icon: Mail,
    title: "Partenariat",
    description: "Une idee de collaboration ou de partenariat",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Contacte-nous
          </h1>
          <p className="text-gray-500 mt-2">
            Une question, un bug ou une idee ? On est la pour toi.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6 space-y-4">
          {reasons.map((reason) => (
            <a
              key={reason.title}
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(reason.title + " — Love101")}`}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                <reason.icon className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{reason.title}</p>
                <p className="text-sm text-gray-500">{reason.description}</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400">
          Ou ecris-nous directement a{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-rose-500 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </div>
  )
}
