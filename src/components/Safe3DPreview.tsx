import * as React from "react"
import { PreviewLoader } from "./PreviewLoader"

function PreviewUnavailable() {
  return (
    <div role="status" className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
      3D preview unavailable on this device.
    </div>
  )
}

class PreviewErrorBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? <PreviewUnavailable /> : this.props.children }
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

export function Safe3DPreview({ children }: { children: React.ReactNode }) {
  const [available, setAvailable] = React.useState<boolean | null>(null)
  React.useEffect(() => { setAvailable(supportsWebGL()) }, [])
  if (available === null) return <PreviewLoader />
  if (!available) return <PreviewUnavailable />
  return <PreviewErrorBoundary>{children}</PreviewErrorBoundary>
}