import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import { captureGroundedPhoto } from "@/lib/grounded-photo"

export interface PhotoCaptureOptions { grounded?: boolean }
export type PhotoCapture = (options?: PhotoCaptureOptions) => Promise<string>

export function PhotoCanvasCapture({ onReady }: { onReady: (fn: PhotoCapture) => void }) {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    onReady((options) => new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          if (options?.grounded) {
            const subject = scene.getObjectByName("photo-furniture")
            if (!subject) throw new Error("Furniture is not ready yet")
            resolve(captureGroundedPhoto(gl, scene, subject))
          } else {
            gl.render(scene, camera)
            resolve(gl.domElement.toDataURL("image/png"))
          }
        } catch (error) { reject(error) }
      })
    }))
  }, [gl, scene, camera, onReady])
  return null
}