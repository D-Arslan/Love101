"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, ExternalLink, Plus } from "lucide-react"
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function CardList({ cards }: CardListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">💌</span>
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
          Aucun message pour l&apos;instant
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Cree ton premier message personnalise !
        </p>
        <Link href="/#templates">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Creer un message
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-gray-700">Mes messages</h2>
        <Link href="/#templates">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Nouveau
          </Button>
        </Link>
      </div>

      {cards.map((card, i) => {
        const template = templates[card.template_type as TemplateType]
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
                  Pour {card.recipient_name}
                </p>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {template?.name ?? card.template_type}
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

            <Link href={`/l/${card.id}`} target="_blank">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </Button>
            </Link>

            <DeleteCardButton cardId={card.id} recipientName={card.recipient_name} />
          </motion.div>
        )
      })}
    </div>
  )
}
