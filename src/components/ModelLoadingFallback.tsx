import { Html } from "@react-three/drei"
import { PreviewLoader } from "./PreviewLoader"

// This is inside the furniture Suspense, not the optional HDR lighting boundary.
export function ModelLoadingFallback() {
  return <Html fullscreen className="pointer-events-none"><PreviewLoader /></Html>
}