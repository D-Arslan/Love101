"use client"

import NextLink from "next/link"
import { motion } from "framer-motion"
import { Eye, ExternalLink, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeleteCardButton } from "./DeleteCardButton"
import { templates } from "@/templates"
import type { TemplateType } from "@/lib/constants"

interface DashboardCard {
  id: string
  template_type: string
  recipient_name: string
  sender_name: string
  created_at: string
  is_published: boolean
  view_count: number
}

interface CardListProps {
  cards: DashboardCard[]
}

export function CardList({ cards }: CardListProps) {
  const locale = useLocale()
  const t = useTranslations("dashboard.cardList")
  const tTemplates = useTranslations("templates")

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">💌</span>
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
          {t("empty")}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {t("emptyDescription")}
        </p>
        <Link href="/#templates">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("createMessage")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-gray-700">{t("myMessages")}</h2>
        <Link href="/#templates">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            {t("new")}
          </Button>
        </Link>
      </div>

      {cards.map((card, i) => {
        const template = templates[card.template_type as TemplateType]
        const templateName = template
          ? tTemplates(`${card.template_type}.name`)
          : card.template_type
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{template?.emoji ?? "💌"}</span>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-gray-900 truncate">
                  {t("forRecipient", { name: card.recipient_name })}
                </p>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {templateName}
                </Badge>
              </div>
              <p className="text-xs text-gray-400">
                {formatDate(card.created_at)}
              </p>
            </div>

            <div className="flex items-center gap-1 text-gray-400 text-xs shrink-0">
              <Eye className="h-3.5 w-3.5" />
              {card.view_count}
            </div>

            <NextLink href={`/l/${card.id}`} target="_blank">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </Button>
            </NextLink>

            <DeleteCardButton cardId={card.id} recipientName={card.recipient_name} />
          </motion.div>
        )
      })}
    </div>
  )
}
