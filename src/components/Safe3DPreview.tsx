import * as React from "react"
import { PreviewLoader } from "./PreviewLoader"

function PreviewUnavailable({ onUnavailable }: { onUnavailable?: () => void }) {
  React.useEffect(() => { onUnavailable?.() }, [onUnavailable])
  return (
    <div role="status" className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
      3D preview unavailable on this device.
    </div>
  )
}

class PreviewErrorBoundary extends React.Component<{ children: React.ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <PreviewUnavailable onUnavailable={this.props.onUnavailable} /> : this.props.children }
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas")
    // Three's current renderer requires WebGL2, not the older WebGL context.
    const context = canvas.getContext("webgl2")
    if (!context) return false
    context.getExtension("WEBGL_lose_context")?.loseContext()
    return true
  } catch { return false }
}

export function Safe3DPreview({ children, onUnavailable }: { children: React.ReactNode; onUnavailable?: () => void }) {
  const [available, setAvailable] = React.useState<boolean | null>(null)
  React.useEffect(() => { setAvailable(supportsWebGL()) }, [])
  if (available === null) return <PreviewLoader />
  if (!available) return <PreviewUnavailable onUnavailable={onUnavailable} />
  return (
    <PreviewErrorBoundary onUnavailable={onUnavailable}>
      <CanvasReadyOverlay>{children}</CanvasReadyOverlay>
    </PreviewErrorBoundary>
  )
}

/** Shows the loader over the preview until a canvas exists and has painted a couple of frames. */
function CanvasReadyOverlay({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [ready, setReady] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const check = () => {
      if (!el.querySelector("canvas")) return
      observer.disconnect()
      raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setReady(true)) })
    }
    const observer = new MutationObserver(check)
    observer.observe(el, { childList: true, subtree: true })
    check()
    return () => { observer.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  return (
    <div ref={ref} className="relative h-full w-full">
      {children}
      {!ready && <div className="absolute inset-0 z-10 bg-secondary/40"><PreviewLoader /></div>}
    </div>
  )
}