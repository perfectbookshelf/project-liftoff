import { Loader2 } from "lucide-react"

export function PreviewLoader() {
  return (
    <div role="status" className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 aria-hidden className="h-6 w-6 animate-spin motion-reduce:animate-none" />
      <span className="whitespace-nowrap text-sm">Loading your bookshelf…</span>
    </div>
  )
}