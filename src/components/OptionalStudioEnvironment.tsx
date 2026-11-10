// Local-only fill lighting. The previous drei "studio" preset downloaded an
// HDR from an external CDN (githack), which is slow/blocked on iOS and could
// leave the 3D blank. No network request is made here.
export function OptionalStudioEnvironment() {
  return <hemisphereLight args={["#ffffff", "#d9cbb8", 0.6]} />
}
