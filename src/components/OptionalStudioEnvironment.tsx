import { Component, Suspense, type ReactNode } from "react"
import { Environment } from "@react-three/drei"

// Lighting enhancement must never hide the furniture while downloading,
// or unmount the configurator when the external HDR host is unavailable.
class LightingBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function OptionalStudioEnvironment() {
  return (
    <LightingBoundary>
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.5} />
      </Suspense>
    </LightingBoundary>
  )
}