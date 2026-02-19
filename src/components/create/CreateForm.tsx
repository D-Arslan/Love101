"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import {
  Send,
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  Heart,
  HelpCircle,
  Sparkles,
  Music,
  HandHeart,
  Star,
  MapPin,
  Gift,
  Search,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { templates, type TemplateConfig } from "@/templates"
import type { TemplateType } from "@/lib/constants"
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH } from "@/lib/constants"
import type { CustomConfig, QuizQuestionData, QuizPrize } from "@/lib/types/database"
import { DEFAULT_SORRY_MESSAGES, DEFAULT_SORRY_REFUSALS } from "@/lib/sorry-defaults"
import { Link } from "@/i18n/navigation"

interface CreateFormProps {
  templateType: TemplateType
}

function emptyQuizQuestion(): QuizQuestionData {
  return { question: "", options: ["", "", "", ""], correct_answer: "" }
}

function emptyQuizPrize(): QuizPrize {
  return { min_score: 0, text: "" }
}

export function CreateForm({ templateType }: CreateFormProps) {
  const router = useRouter()
  const t = useTranslations("create")
  const tCommon = useTranslations("common")
  const tTemplates = useTranslations("templates")
  const template: TemplateConfig = templates[templateType]
  const features = template.features

  const [recipientName, setRecipientName] = useState("")
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [colors, setColors] = useState(template.defaultColors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Feature states
  const [countdownDate, setCountdownDate] = useState("")
  const [reasons, setReasons] = useState<string[]>([""])
  const [promises, setPromises] = useState<string[]>([""])
  const [memories, setMemories] = useState<string[]>([""])
  const [quiz, setQuiz] = useState<QuizQuestionData[]>([emptyQuizQuestion()])
  const [quizPrizes, setQuizPrizes] = useState<QuizPrize[]>([emptyQuizPrize()])
  const [scratchText, setScratchText] = useState("")
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [musicUrl, setMusicUrl] = useState("")
  const [sorryMessages, setSorryMessages] = useState<string[]>([...DEFAULT_SORRY_MESSAGES])
  const [sorryRefusals, setSorryRefusals] = useState<string[]>([...DEFAULT_SORRY_REFUSALS])
  const [rdvDate, setRdvDate] = useState("")
  const [rdvTime, setRdvTime] = useState("")
  const [rdvLocation, setRdvLocation] = useState("")
  const [rdvTheme, setRdvTheme] = useState("")
  const [rdvClues, setRdvClues] = useState<string[]>([""])

  const placeholderRecipient = tTemplates(`${templateType}.placeholder.recipientName`)
  const placeholderSender = tTemplates(`${templateType}.placeholder.senderName`)
  const placeholderMessage = tTemplates(`${templateType}.placeholder.message`)

  function buildCustomConfig(): CustomConfig {
    const config: CustomConfig = {}

    if (features.includes("countdown") && countdownDate) {
      config.countdown_date = countdownDate
      if (templateType === "anniversary") {
        config.countdown_direction = "up"
      }
    }

    if (features.includes("reasons")) {
      const filtered = reasons.filter((r) => r.trim())
      if (filtered.length > 0) config.reasons = filtered
    }

    if (features.includes("promises")) {
      const filtered = promises.filter((p) => p.trim())
      if (filtered.length > 0) config.promises = filtered
    }

    if (features.includes("memories")) {
      const filtered = memories.filter((m) => m.trim())
      if (filtered.length > 0) config.memories = filtered
    }

    if (features.includes("sorry-algorithm")) {
      const filteredMsg = sorryMessages.filter((m) => m.trim())
      if (filteredMsg.length > 0) config.sorry_messages = filteredMsg
      const filteredRef = sorryRefusals.filter((r) => r.trim())
      if (filteredRef.length > 0) config.sorry_refusals = filteredRef
    }

    if (features.includes("quiz") || features.includes("quiz-prizes")) {
      const valid = quiz.filter(
        (q) => q.question.trim() && q.options.every((o) => o.trim()) && q.correct_answer.trim()
      )
      if (valid.length > 0) config.quiz = valid
    }

    if (features.includes("quiz-prizes")) {
      const valid = quizPrizes.filter((p) => p.text.trim())
      if (valid.length > 0) config.quiz_prizes = valid
    }

    if (features.includes("scratch") && scratchText.trim()) {
      config.scratch_text = scratchText
    }

    if (features.includes("music")) {
      config.music_enabled = musicEnabled
      if (musicEnabled && musicUrl.trim()) {
        config.music_url = musicUrl
      }
    }

    if (features.includes("rdv-details")) {
      if (rdvDate && rdvTime && rdvLocation.trim()) {
        config.rdv = {
          date: rdvDate,
          time: rdvTime,
          location: rdvLocation,
          ...(rdvTheme.trim() ? { theme: rdvTheme } : {}),
        }
        if (features.includes("countdown") && !countdownDate) {
          config.countdown_date = `${rdvDate}T${rdvTime}`
        }
      }
    }

    if (features.includes("rdv-clues")) {
      const filtered = rdvClues.filter((c) => c.trim())
      if (filtered.length > 0) config.rdv_clues = filtered
    }

    return config
  }

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
          custom_config: buildCustomConfig(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t("error.generic"))
        return
      }

      router.push(`/l/${data.card.id}`)
    } catch {
      setError(t("error.network"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const colorLabels = [
    { key: "primary" as const, label: t("colorPrimary") },
    { key: "secondary" as const, label: t("colorSecondary") },
    { key: "background" as const, label: t("colorBackground") },
    { key: "text" as const, label: t("colorText") },
  ]

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
            {tCommon("back")}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{template.emoji}</span>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                {tTemplates(`${templateType}.name`)}
              </h1>
              <p className="text-gray-500 text-sm">{tTemplates(`${templateType}.description`)}</p>
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
            {/* Basic fields */}
            <div className="space-y-2">
              <Label htmlFor="recipientName">
                {t("recipientLabel", { placeholder: placeholderRecipient })}
              </Label>
              <Input id="recipientName" placeholder={placeholderRecipient} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} maxLength={MAX_NAME_LENGTH} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderName">
                {t("senderLabel", { placeholder: placeholderSender })}
              </Label>
              <Input id="senderName" placeholder={placeholderSender} value={senderName} onChange={(e) => setSenderName(e.target.value)} maxLength={MAX_NAME_LENGTH} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("messageLabel")}</Label>
              <Textarea id="message" placeholder={placeholderMessage} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={MAX_MESSAGE_LENGTH} rows={6} required className="resize-none" />
              <p className="text-xs text-gray-400 text-right">{message.length}/{MAX_MESSAGE_LENGTH}</p>
            </div>

            {/* Color pickers */}
            <div className="space-y-3">
              <Label>{t("colorsLabel")}</Label>
              <div className="grid grid-cols-2 gap-3">
                {colorLabels.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <input type="color" value={colors[key]} onChange={(e) => setColors((prev) => ({ ...prev, [key]: e.target.value }))} className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer" />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* === FEATURE SECTIONS === */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-semibold text-gray-700 mb-4">{t("featuresTitle")}</p>

              {/* RDV Details */}
              {features.includes("rdv-details") && (
                <div className="space-y-3 mb-5">
                  <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" />{t("rdv.title")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs text-gray-400">{t("rdv.date")}</Label><Input type="date" value={rdvDate} onChange={(e) => setRdvDate(e.target.value)} /></div>
                    <div><Label className="text-xs text-gray-400">{t("rdv.time")}</Label><Input type="time" value={rdvTime} onChange={(e) => setRdvTime(e.target.value)} /></div>
                  </div>
                  <div><Label className="text-xs text-gray-400">{t("rdv.location")}</Label><Input placeholder={t("rdv.locationPlaceholder")} value={rdvLocation} onChange={(e) => setRdvLocation(e.target.value)} maxLength={200} /></div>
                  <div><Label className="text-xs text-gray-400">{t("rdv.theme")}</Label><Input placeholder={t("rdv.themePlaceholder")} value={rdvTheme} onChange={(e) => setRdvTheme(e.target.value)} maxLength={200} /></div>
                </div>
              )}

              {/* RDV Clues */}
              {features.includes("rdv-clues") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><Search className="h-4 w-4 text-gray-400" />{t("clues.title", { count: rdvClues.length })}</Label>
                  <p className="text-xs text-gray-400">{t("clues.description")}</p>
                  <div className="space-y-2">
                    {rdvClues.map((clue, i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder={t("clues.placeholder", { number: i + 1 })} value={clue} onChange={(e) => { const next = [...rdvClues]; next[i] = e.target.value; setRdvClues(next) }} maxLength={200} />
                        {rdvClues.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => setRdvClues(rdvClues.filter((_, j) => j !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-gray-400" /></Button>)}
                      </div>
                    ))}
                  </div>
                  {rdvClues.length < 5 && (<Button type="button" variant="outline" size="sm" onClick={() => setRdvClues([...rdvClues, ""])} className="mt-1"><Plus className="h-4 w-4 mr-1" />{t("clues.add")}</Button>)}
                </div>
              )}

              {/* Countdown */}
              {features.includes("countdown") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" />{templateType === "anniversary" ? t("countdown.anniversary") : features.includes("rdv-details") ? t("countdown.withRdv") : t("countdown.default")}</Label>
                  <Input type="datetime-local" value={countdownDate} onChange={(e) => setCountdownDate(e.target.value)} />
                  <p className="text-xs text-gray-400">{templateType === "anniversary" ? t("countdown.anniversaryHint") : t("countdown.defaultHint")}</p>
                </div>
              )}

              {/* Reasons */}
              {features.includes("reasons") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><Heart className="h-4 w-4 text-gray-400" />{t("reasons.title", { count: reasons.length })}</Label>
                  <div className="space-y-2">
                    {reasons.map((reason, i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder={t("reasons.placeholder", { number: i + 1 })} value={reason} onChange={(e) => { const next = [...reasons]; next[i] = e.target.value; setReasons(next) }} maxLength={200} />
                        {reasons.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => setReasons(reasons.filter((_, j) => j !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-gray-400" /></Button>)}
                      </div>
                    ))}
                  </div>
                  {reasons.length < 10 && (<Button type="button" variant="outline" size="sm" onClick={() => setReasons([...reasons, ""])} className="mt-1"><Plus className="h-4 w-4 mr-1" />{t("reasons.add")}</Button>)}
                </div>
              )}

              {/* Promises */}
              {features.includes("promises") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><HandHeart className="h-4 w-4 text-gray-400" />{t("promises.title", { count: promises.length })}</Label>
                  <div className="space-y-2">
                    {promises.map((promise, i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder={t("promises.placeholder", { number: i + 1 })} value={promise} onChange={(e) => { const next = [...promises]; next[i] = e.target.value; setPromises(next) }} maxLength={200} />
                        {promises.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => setPromises(promises.filter((_, j) => j !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-gray-400" /></Button>)}
                      </div>
                    ))}
                  </div>
                  {promises.length < 10 && (<Button type="button" variant="outline" size="sm" onClick={() => setPromises([...promises, ""])} className="mt-1"><Plus className="h-4 w-4 mr-1" />{t("promises.add")}</Button>)}
                </div>
              )}

              {/* Sorry Messages */}
              {features.includes("sorry-algorithm") && (
                <div className="space-y-4 mb-5">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-gray-400" />{t("sorry.messagesTitle", { count: sorryMessages.length })}</Label>
                    <p className="text-xs text-gray-400">{t("sorry.messagesDescription")}</p>
                    <div className="space-y-2">
                      {sorryMessages.map((msg, i) => (
                        <div key={i} className="flex gap-2">
                          <Input placeholder={t("sorry.messagePlaceholder", { number: i + 1 })} value={msg} onChange={(e) => { const next = [...sorryMessages]; next[i] = e.target.value; setSorryMessages(next) }} maxLength={300} />
                          {sorryMessages.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => setSorryMessages(sorryMessages.filter((_, j) => j !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-gray-400" /></Button>)}
                        </div>
                      ))}
                    </div>
                    {sorryMessages.length < 20 && (<Button type="button" variant="outline" size="sm" onClick={() => setSorryMessages([...sorryMessages, ""])} className="mt-1"><Plus className="h-4 w-4 mr-1" />{t("sorry.addMessage")}</Button>)}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-gray-400" />{t("sorry.refusalsTitle", { count: sorryRefusals.length })}</Label>
                    <p className="text-xs text-gray-400">{t("sorry.refusalsDescription")}</p>
                    <div className="space-y-2">
                      {sorryRefusals.map((ref, i) => (
                        <div key={i} className="flex gap-2">
                          <Input placeholder={t("sorry.refusalPlaceholder", { number: i + 1 })} value={ref} onChange={(e) => { const next = [...sorryRefusals]; next[i] = e.target.value; setSorryRefusals(next) }} maxLength={300} />
                          {sorryRefusals.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => setSorryRefusals(sorryRefusals.filter((_, j) => j !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-gray-400" /></Button>)}
                        </div>
                      ))}
                    </div>
                    {sorryRefusals.length < 13 && (<Button type="button" variant="outline" size="sm" onClick={() => setSorryRefusals([...sorryRefusals, ""])} className="mt-1"><Plus className="h-4 w-4 mr-1" />{t("sorry.addRefusal")}</Button>)}
                  </div>
                </div>
              )}

              {/* Memories */}
              {features.includes("memories") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><Star className="h-4 w-4 text-gray-400" />{t("memories.title", { count: memories.length })}</Label>
                  <div className="space-y-2">
                    {memories.map((memory, i) => (
                      <div key={i} className="flex gap-2">
                        <Input placeholder={t("memories.placeholder", { number: i + 1 })} value={memory} onChange={(e) => { const next = [...memories]; next[i] = e.target.value; setMemories(next) }} maxLength={200} />
                        {memories.length > 1 && (<Button type="button" variant="ghost" size="icon" onClick={() => setMemories(memories.filter((_, j) => j !== i))} className="shrink-0"><Trash2 className="h-4 w-4 text-gray-400" /></Button>)}
                      </div>
                    ))}
                  </div>
                  {memories.length < 10 && (<Button type="button" variant="outline" size="sm" onClick={() => setMemories([...memories, ""])} className="mt-1"><Plus className="h-4 w-4 mr-1" />{t("memories.add")}</Button>)}
                </div>
              )}

              {/* Quiz */}
              {(features.includes("quiz") || features.includes("quiz-prizes")) && (
                <div className="space-y-3 mb-5">
                  <Label className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-gray-400" />{t("quiz.title", { count: quiz.length })}</Label>
                  {quiz.map((q, qi) => (
                    <div key={qi} className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">{t("quiz.question", { number: qi + 1 })}</span>
                        {quiz.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQuiz(quiz.filter((_, j) => j !== qi))}><Trash2 className="h-3 w-3 text-gray-400" /></Button>)}
                      </div>
                      <Input placeholder={t("quiz.questionPlaceholder")} value={q.question} onChange={(e) => { const next = [...quiz]; next[qi] = { ...next[qi], question: e.target.value }; setQuiz(next) }} maxLength={200} />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (<Input key={oi} placeholder={t("quiz.optionPlaceholder", { number: oi + 1 })} value={opt} onChange={(e) => { const next = [...quiz]; const opts = [...next[qi].options]; opts[oi] = e.target.value; next[qi] = { ...next[qi], options: opts }; setQuiz(next) }} maxLength={100} />))}
                      </div>
                      <Input placeholder={t("quiz.correctAnswer")} value={q.correct_answer} onChange={(e) => { const next = [...quiz]; next[qi] = { ...next[qi], correct_answer: e.target.value }; setQuiz(next) }} maxLength={100} />
                    </div>
                  ))}
                  {quiz.length < 5 && (<Button type="button" variant="outline" size="sm" onClick={() => setQuiz([...quiz, emptyQuizQuestion()])}><Plus className="h-4 w-4 mr-1" />{t("quiz.addQuestion")}</Button>)}
                </div>
              )}

              {/* Quiz Prizes */}
              {features.includes("quiz-prizes") && (
                <div className="space-y-3 mb-5">
                  <Label className="flex items-center gap-2"><Gift className="h-4 w-4 text-gray-400" />{t("prizes.title", { count: quizPrizes.length })}</Label>
                  <p className="text-xs text-gray-400">{t("prizes.description")}</p>
                  {quizPrizes.map((prize, pi) => (
                    <div key={pi} className="bg-gray-50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">{t("prizes.prize", { number: pi + 1 })}</span>
                        {quizPrizes.length > 1 && (<Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQuizPrizes(quizPrizes.filter((_, j) => j !== pi))}><Trash2 className="h-3 w-3 text-gray-400" /></Button>)}
                      </div>
                      <div className="flex gap-2">
                        <div className="w-24"><Input type="number" min={0} max={5} placeholder={t("prizes.scoreMin")} value={prize.min_score || ""} onChange={(e) => { const next = [...quizPrizes]; next[pi] = { ...next[pi], min_score: parseInt(e.target.value) || 0 }; setQuizPrizes(next) }} /></div>
                        <Input placeholder={t("prizes.textPlaceholder")} value={prize.text} onChange={(e) => { const next = [...quizPrizes]; next[pi] = { ...next[pi], text: e.target.value }; setQuizPrizes(next) }} maxLength={200} />
                      </div>
                    </div>
                  ))}
                  {quizPrizes.length < 5 && (<Button type="button" variant="outline" size="sm" onClick={() => setQuizPrizes([...quizPrizes, emptyQuizPrize()])}><Plus className="h-4 w-4 mr-1" />{t("prizes.add")}</Button>)}
                </div>
              )}

              {/* Scratch */}
              {features.includes("scratch") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-gray-400" />{t("scratch.title")}</Label>
                  <Input placeholder={t("scratch.placeholder")} value={scratchText} onChange={(e) => setScratchText(e.target.value)} maxLength={200} />
                </div>
              )}

              {/* Music */}
              {features.includes("music") && (
                <div className="space-y-2 mb-5">
                  <Label className="flex items-center gap-2"><Music className="h-4 w-4 text-gray-400" />{t("music.title")}</Label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={musicEnabled} onChange={(e) => setMusicEnabled(e.target.checked)} className="rounded" />
                    <span className="text-sm text-gray-600">{t("music.enable")}</span>
                  </label>
                  {musicEnabled && (<Input placeholder={t("music.urlPlaceholder")} value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} />)}
                  <p className="text-xs text-gray-400">{t("music.hint")}</p>
                </div>
              )}
            </div>

            {error && (<p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>)}

            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-6 rounded-xl text-lg cursor-pointer">
              {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t("submit.creating")}</>) : (<><Send className="mr-2 h-5 w-5" />{t("submit.create")}</>)}
            </Button>
          </motion.form>

          {/* Live Preview */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:sticky lg:top-8 h-fit">
            <p className="text-sm font-medium text-gray-500 mb-3">{t("preview.title")}</p>
            <div className="rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center shadow-sm border border-gray-100 transition-colors duration-300" style={{ backgroundColor: colors.background, color: colors.text }}>
              <motion.div key={`${recipientName}-${senderName}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="w-full">
                <span className="text-5xl mb-4 block">{template.emoji}</span>
                <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: colors.primary }}>
                  {t("preview.forRecipient", { name: recipientName || placeholderRecipient })}
                </h2>
                <div className="w-12 h-0.5 mx-auto my-4 rounded-full" style={{ backgroundColor: colors.secondary }} />
                <p className="whitespace-pre-wrap leading-relaxed mb-6 max-w-md mx-auto">{message || placeholderMessage}</p>
                <p className="text-sm font-medium" style={{ color: colors.secondary }}>— {senderName || placeholderSender}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
