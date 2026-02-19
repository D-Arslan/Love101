"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, FileHeart } from "lucide-react"

interface CardStatsProps {
  totalCards: number
  totalViews: number
}

export function CardStats({ totalCards, totalViews }: CardStatsProps) {
  const t = useTranslations("dashboard.stats")

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-rose-50 rounded-lg">
            <FileHeart className="h-5 w-5 text-rose-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
            <p className="text-xs text-gray-500">{t("messagesCreated")}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Eye className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            <p className="text-xs text-gray-500">{t("totalViews")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
