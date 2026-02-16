"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Send, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { templates, type TemplateConfig } from "@/templates"
import type { TemplateType } from "@/lib/constants"
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/lib/constants"

interface CreateFormProps {
  templateType: TemplateType
}

export function CreateForm({ templateType }: CreateFormProps) {
  const router = useRouter()
  const template: TemplateConfig = templates[templateType]

  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [colors, setColors] = useState(template.defaultColors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_type: templateType,
          recipient_name: recipientName,
          sender_name: senderName,
          message,
          theme_colors: colors,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue")
        return
      }

      router.push(`/l/${data.card.id}`)
    } catch {
      setError("Impossible de contacter le serveur")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{template.emoji}</span>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                {template.name}
              </h1>
              <p className="text-gray-500 text-sm">{template.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="space-y-2">
              <Label htmlFor="recipientName">
                Pour qui ? {template.placeholder.recipientName && `(ex: ${template.placeholder.recipientName})`}
              </Label>
              <Input
                id="recipientName"
                placeholder={template.placeholder.recipientName}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                maxLength={MAX_NAME_LENGTH}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderName">
                De la part de ? {template.placeholder.senderName && `(ex: ${template.placeholder.senderName})`}
              </Label>
              <Input
                id="senderName"
                placeholder={template.placeholder.senderName}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                maxLength={MAX_NAME_LENGTH}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Ton message
              </Label>
              <Textarea
                id="message"
                placeholder={template.placeholder.message}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={6}
                required
                className="resize-none"
              />
              <p className="text-xs text-gray-400 text-right">
                {message.length}/{MAX_MESSAGE_LENGTH}
              </p>
            </div>

            {/* Color pickers */}
            <div className="space-y-3">
              <Label>Couleurs</Label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { key: "primary", label: "Principale" },
                    { key: "secondary", label: "Secondaire" },
                    { key: "background", label: "Fond" },
                    { key: "text", label: "Texte" },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={colors[key]}
                      onChange={(e) =>
                        setColors((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-6 rounded-xl text-lg cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Créer le message
                </>
              )}
            </Button>
          </motion.form>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <p className="text-sm font-medium text-gray-500 mb-3">Aperçu</p>
            <div
              className="rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 transition-colors duration-300"
              style={{
                backgroundColor: colors.background,
                color: colors.text,
              }}
            >
              <motion.div
                key={`${recipientName}-${senderName}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <span className="text-5xl mb-4 block">{template.emoji}</span>
                <h2
                  className="font-serif text-2xl font-bold mb-2"
                  style={{ color: colors.primary }}
                >
                  {recipientName
                    ? `Pour ${recipientName}`
                    : `Pour ${template.placeholder.recipientName}`}
                </h2>
                <div
                  className="w-12 h-0.5 mx-auto my-4 rounded-full"
                  style={{ backgroundColor: colors.secondary }}
                />
                <p className="whitespace-pre-wrap leading-relaxed mb-6 max-w-md mx-auto">
                  {message || template.placeholder.message}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: colors.secondary }}
                >
                  — {senderName || template.placeholder.senderName}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
