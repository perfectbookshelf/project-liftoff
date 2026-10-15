import * as THREE from "three"

/** Clone only furniture, never the preview's elevated shadows or camera framing. */
export function prepareGroundedPhoto(subject: THREE.Object3D, environment: THREE.Texture | null, floorColor: string) {
  subject.updateWorldMatrix(true, true)
  const model = subject.clone(true)
  model.position.copy(subject.getWorldPosition(new THREE.Vector3()))
  model.quaternion.copy(subject.getWorldQuaternion(new THREE.Quaternion()))
  model.scale.copy(subject.getWorldScale(new THREE.Vector3()))
  model.updateWorldMatrix(true, true)
  const originalBounds = new THREE.Box3().setFromObject(model)
  const center = originalBounds.getCenter(new THREE.Vector3())
  model.position.sub(new THREE.Vector3(center.x, originalBounds.min.y, center.z))
  model.updateWorldMatrix(true, true)
  const bounds = new THREE.Box3().setFromObject(model)
  const size = bounds.getSize(new THREE.Vector3())
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(floorColor)
  scene.environment = environment
  scene.add(model)

  const span = Math.max(size.x, size.y, size.z, 1)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(span * 12, span * 12),
    new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.9 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.005
  floor.receiveShadow = true
  scene.add(floor, new THREE.AmbientLight(undefined, 0.8))
  const light = new THREE.DirectionalLight(undefined, 2)
  light.position.set(span, span * 2, span * 2)
  light.castShadow = true
  light.shadow.mapSize.set(2048, 2048)
  light.shadow.camera.left = -span * 2
  light.shadow.camera.right = span * 2
  light.shadow.camera.top = span * 2
  light.shadow.camera.bottom = -span * 2
  light.shadow.camera.far = span * 8
  light.shadow.normalBias = 0.02
  scene.add(light)

  const camera = new THREE.PerspectiveCamera(40, 4 / 3, 0.1, span * 30)
  const distance = Math.max(size.y / 2, size.x / (2 * camera.aspect)) / Math.tan(THREE.MathUtils.degToRad(20)) * 1.4 + size.z
  camera.position.set(size.x * 0.15, size.y * 0.65, distance)
  camera.lookAt(0, size.y * 0.45, 0)
  return { scene, camera, model, floor, light }
}

export function captureGroundedPhoto(gl: THREE.WebGLRenderer, source: THREE.Scene, subject: THREE.Object3D): string {
  const floorColor = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
  const photo = prepareGroundedPhoto(subject, source.environment, floorColor)
  const width = 1024, height = 768
  const target = new THREE.WebGLRenderTarget(width, height)
  const previousTarget = gl.getRenderTarget()
  try {
    gl.setRenderTarget(target)
    gl.clear()
    gl.render(photo.scene, photo.camera)
    const pixels = new Uint8Array(width * height * 4)
    gl.readRenderTargetPixels(target, 0, 0, width, height, pixels)
    const canvas = document.createElement("canvas")
    canvas.width = width; canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Photo capture unavailable")
    const image = context.createImageData(width, height)
    for (let y = 0; y < height; y++) {
      image.data.set(pixels.subarray((height - y - 1) * width * 4, (height - y) * width * 4), y * width * 4)
    }
    context.putImageData(image, 0, 0)
    return canvas.toDataURL("image/png")
  } finally {
    gl.setRenderTarget(previousTarget)
    target.dispose()
    photo.floor.geometry.dispose()
    photo.floor.material.dispose()
    photo.light.shadow.map?.dispose()
  }
}