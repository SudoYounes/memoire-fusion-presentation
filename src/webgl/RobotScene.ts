import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  DirectionalLight,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type RobotSceneOptions = {
  reducedMotion?: boolean
}

type RobotFocus = 'all' | 'structure' | 'transmission' | 'tool'

const focusParts: Record<Exclude<RobotFocus, 'all'>, Set<string>> = {
  structure: new Set(['A', 'B', 'C', 'D', 'F', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']),
  transmission: new Set(['E', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'R', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI']),
  tool: new Set(['F', 'G', 'P', 'Q']),
}

const focusReferences: Record<Exclude<RobotFocus, 'all'>, RegExp> = {
  structure: /^REF-J1-/,
  transmission: /^REF-(J2|J3|RV|CD|GE30|LINK|LCS)/,
  tool: /^REF-(TCP|TOOL|GRIP)/,
}

function partCode(object: Object3D, root: Object3D): string | null {
  let cursor: Object3D | null = object
  while (cursor && cursor !== root) {
    const match = cursor.name.match(/^R2-([A-Z]{1,2})-/)
    if (match) return match[1]
    cursor = cursor.parent
  }
  return null
}

function referenceMatches(object: Object3D, root: Object3D, focus: Exclude<RobotFocus, 'all'>): boolean {
  let cursor: Object3D | null = object
  while (cursor && cursor !== root) {
    if (focusReferences[focus].test(cursor.name)) return true
    cursor = cursor.parent
  }
  return false
}

export class RobotScene {
  readonly scene = new Scene()
  readonly camera = new PerspectiveCamera(31, 1, 0.01, 100)
  readonly renderer: WebGLRenderer

  private readonly canvas: HTMLCanvasElement
  private readonly controls: OrbitControls
  private readonly resizeObserver: ResizeObserver
  private readonly intersectionObserver: IntersectionObserver
  private readonly shell: HTMLElement | null
  private readonly grid: GridHelper
  private readonly overview: boolean
  private readonly reducedMotion: boolean
  private readonly focusButtons: HTMLButtonElement[]
  private model: Group | null = null
  private frame = 0
  private visible = false
  private disposed = false

  constructor(canvas: HTMLCanvasElement, options: RobotSceneOptions = {}) {
    this.canvas = canvas
    this.shell = canvas.closest<HTMLElement>('.webgl-shell')
    this.overview = canvas.dataset.robotKind === 'overview'
    this.reducedMotion = Boolean(options.reducedMotion)
    this.focusButtons = Array.from(this.shell?.querySelectorAll<HTMLButtonElement>('[data-robot-focus]') ?? [])
    this.renderer = new WebGLRenderer({ alpha: true, antialias: true, canvas, powerPreference: 'high-performance' })
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = this.overview ? 1.12 : 1.05
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    this.camera.position.set(this.overview ? 5.6 : 4.7, this.overview ? 3.4 : 3.1, this.overview ? 6.8 : 5.8)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.enablePan = false
    this.controls.enableZoom = false
    this.controls.autoRotate = !this.reducedMotion
    this.controls.autoRotateSpeed = this.overview ? 0.38 : 0.62
    this.controls.target.set(0, 0, 0)

    this.scene.add(new HemisphereLight(0xd7f7f4, 0x172631, this.overview ? 2.45 : 2.1))
    const key = new DirectionalLight(0xffffff, this.overview ? 4.8 : 4.2)
    key.position.set(4, 7, 5)
    this.scene.add(key)
    const rim = new DirectionalLight(0x55c8cf, this.overview ? 2.8 : 2.4)
    rim.position.set(-5, 2, -4)
    this.scene.add(rim)
    this.grid = new GridHelper(this.overview ? 7.5 : 6.5, this.overview ? 15 : 13, new Color(0x4aa6aa), new Color(0x243a43))
    this.grid.position.y = -1.55
    this.scene.add(this.grid)

    this.focusButtons.forEach((button) => button.addEventListener('click', this.onFocusClick))
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting
      if (this.visible) this.start()
      else this.stop()
    }, { threshold: 0.02 })
    this.intersectionObserver.observe(canvas)

    this.canvas.addEventListener('webglcontextlost', this.onContextLost)
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    this.resize()
    this.loadModel()
  }

  dispose(): void {
    this.disposed = true
    this.stop()
    this.resizeObserver.disconnect()
    this.intersectionObserver.disconnect()
    this.controls.dispose()
    this.focusButtons.forEach((button) => button.removeEventListener('click', this.onFocusClick))
    this.model?.traverse((object) => {
      if (!(object instanceof Mesh)) return
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => material.dispose())
    })
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    this.renderer.dispose()
  }

  private loadModel(): void {
    const status = this.shell?.querySelector<HTMLElement>('[data-webgl-status]')
    const modelUrl = this.canvas.dataset.robotModel ?? './models/j3-articulation.glb'
    new GLTFLoader().load(
      modelUrl,
      (gltf) => {
        if (this.disposed) return
        const source = gltf.scene
        source.traverse((object) => {
          if (!(object instanceof Mesh)) return
          object.castShadow = true
          object.receiveShadow = true
          object.userData.robotPartCode = partCode(object, source)
        })
        const initialBounds = new Box3().setFromObject(source)
        const center = initialBounds.getCenter(new Vector3())
        const size = initialBounds.getSize(new Vector3())
        const targetSize = this.overview ? 4.65 : 3.25
        const scale = targetSize / Math.max(size.x, size.y, size.z, 0.001)
        source.position.sub(center)
        this.model = new Group()
        this.model.add(source)
        this.model.scale.setScalar(scale)
        this.model.rotation.set(this.overview ? -0.05 : -0.16, this.overview ? -0.64 : -0.7, this.overview ? 0 : 0.06)
        this.scene.add(this.model)
        const fittedBounds = new Box3().setFromObject(this.model)
        this.grid.position.y = fittedBounds.min.y - 0.04
        this.shell?.classList.add('is-ready')
        if (status) status.textContent = this.overview ? 'Robot complet prêt' : 'Modèle 3D prêt'
        this.applyFocus('all')
        this.render()
        this.start()
      },
      undefined,
      () => {
        if (status) status.textContent = 'Poster CAO · mode de repli'
      },
    )
  }

  private applyFocus(focus: RobotFocus): void {
    if (!this.model) return
    const targetCodes = focus === 'all' ? null : focusParts[focus]
    let matchedMeshes = 0
    this.model.traverse((object) => {
      if (!(object instanceof Mesh)) return
      const code = object.userData.robotPartCode as string | null
      const matches = targetCodes === null
        || (code !== null && targetCodes.has(code))
        || referenceMatches(object, this.model as Group, focus as Exclude<RobotFocus, 'all'>)
      object.visible = matches
      if (matches) matchedMeshes += 1
    })
    if (focus !== 'all' && matchedMeshes === 0) {
      this.model.traverse((object) => {
        if (object instanceof Mesh) object.visible = true
      })
      focus = 'all'
    }
    this.focusButtons.forEach((button) => {
      const active = button.dataset.robotFocus === focus
      button.setAttribute('aria-pressed', String(active))
    })
    this.controls.autoRotate = focus === 'all' && !this.reducedMotion
    this.render()
  }

  private readonly onFocusClick = (event: Event) => {
    const button = event.currentTarget as HTMLButtonElement
    const focus = button.dataset.robotFocus as RobotFocus | undefined
    if (focus) this.applyFocus(focus)
  }

  private readonly render = () => {
    this.renderer.render(this.scene, this.camera)
  }

  private readonly tick = () => {
    this.frame = 0
    if (this.disposed || !this.visible || document.hidden) return
    this.controls.update()
    this.render()
    this.frame = requestAnimationFrame(this.tick)
  }

  private start(): void {
    if (this.frame || !this.visible || document.hidden) return
    this.frame = requestAnimationFrame(this.tick)
  }

  private stop(): void {
    if (this.frame) cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  private resize(): void {
    const width = Math.max(this.canvas.clientWidth, 1)
    const height = Math.max(this.canvas.clientHeight, 1)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.render()
  }

  private readonly onContextLost = (event: Event) => {
    event.preventDefault()
    this.stop()
  }

  private readonly onContextRestored = () => {
    this.resize()
    this.start()
  }

  private readonly onVisibilityChange = () => {
    if (document.hidden) this.stop()
    else this.start()
  }
}
