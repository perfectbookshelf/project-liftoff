import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DesignMessageSchema } from "@/lib/design-message"

interface Props {
  open: boolean
  onClose: () => void
  initialEmail: string
  summary: string
  productType: string
  price: number
  config: Record<string, unknown>
  onSent: () => void
}

/** "Talk to us" message form; sends the current design along with the message. */
export function TalkToUsSheet({ open, onClose, initialEmail, summary, productType, price, config, onSent }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (open) { setEmail((e) => e || initialEmail); setError(null); setSent(false) }
  }, [open, initialEmail])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey) }
  }, [open, onClose])

  if (!open) return null

  const submit = async () => {
    const payload = { name, email, phone, message, productType, price: Math.round(price * 100) / 100, config }
    const parsed = DesignMessageSchema.safeParse(payload)
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check the form."); return }
    setSending(true); setError(null)
    try {
      const res = await fetch("/api/public/pbs-design-message", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "Could not send your message.")
      setSent(true); setMessage(""); onSent()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send your message.")
    } finally { setSending(false) }
  }

  const label = "text-[11px] tracking-[0.2em] uppercase text-muted-foreground"
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="talk-title">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div className={cn("relative w-full sm:max-w-md bg-background border-t sm:border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl",
        "px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 max-h-[92dvh] overflow-y-auto")}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <h2 id="talk-title" className="font-display text-lg tracking-[0.12em] uppercase text-foreground">Talk to us</h2>
            <p className="text-sm text-muted-foreground leading-snug">Questions about your design? We'll see your exact design: {summary}.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        {sent ? (
          <div className="space-y-4">
            <p className="text-sm text-foreground">Thanks — your message and design are on their way. We'll reply by email.</p>
            <Button onClick={onClose} className="w-full h-11 rounded-none tracking-[0.2em] uppercase text-[11px] font-semibold">Back to my design</Button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); void submit() }} className="space-y-3">
            <label className="block"><span className={label}>Name</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className="h-11 mt-2" /></label>
            <label className="block"><span className={label}>Email</span>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email" className="h-11 mt-2" /></label>
            <label className="block"><span className={label}>Phone (optional)</span>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} autoComplete="tel" className="h-11 mt-2" /></label>
            <label className="block"><span className={label}>Message</span>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={4} className="mt-2" placeholder="Ask about sizes, wood, delivery…" /></label>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" disabled={sending} className="w-full h-11 rounded-none tracking-[0.2em] uppercase text-[11px] font-semibold">
              {sending ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
