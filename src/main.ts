import 'lenis/dist/lenis.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/story.css'
import './styles/pipeline.css'
import './styles/pipeline-master.css'
import './styles/models.css'
import './styles/models-artifacts.css'
import './styles/observer.css'
import './styles/orchestration.css'
import './styles/trajectory.css'
import './styles/trajectory-plates.css'
import './styles/runtime.css'
import './styles/results.css'
import './styles/pipeline-navigation.css'
import './styles/motion.css'
import './styles/presentation-mode.css'
import './styles/industrial-context.css'
import './styles/smed-challenge.css'

import { setupDeck } from './deck/setupDeck'
import { mountPipelineMaps } from './deck/pipelineNavigation'
import { prefersReducedMotion } from './motion/preferences'
import { renderCycleEvidence } from './visuals/cyclePlot'
import { mountSlideAtmospheres } from './visuals/slideAtmosphere'
import { mountObserverFigure } from './visuals/observerFigure'
import { mountCoordinationNarrative } from './visuals/coordinationNarrative'
import { mountTrajectoryNarrative } from './visuals/trajectoryNarrative'
import { mountRuntimeNarrative } from './visuals/runtimeNarrative'
import { mountResultsNarrative } from './visuals/resultsNarrative'
import { mountPresentationMode } from './deck/presentationMode'
import { mountIndustrialContext } from './visuals/industrialContext'
import { mountSmedChallenge } from './visuals/smedChallenge'
import type { RobotScene } from './webgl/RobotScene'

document.documentElement.classList.add('has-js')
mountPipelineMaps()
mountSlideAtmospheres()
renderCycleEvidence()
const disposeObserverFigure = mountObserverFigure()
const disposeCoordinationNarrative = mountCoordinationNarrative()
const disposeTrajectoryNarrative = mountTrajectoryNarrative()
const disposeRuntimeNarrative = mountRuntimeNarrative()
const disposeResultsNarrative = mountResultsNarrative()
const disposeIndustrialContext = mountIndustrialContext()
const disposeSmedChallenge = mountSmedChallenge()

const disposeDeck = setupDeck()
const disposePresentationMode = mountPresentationMode()
const canvases = Array.from(document.querySelectorAll<HTMLCanvasElement>('[data-robot-canvas]'))
const renderParams = new URLSearchParams(window.location.search)
const staticMode = renderParams.has('capture') || renderParams.has('print')
const robotScenes: RobotScene[] = []
const viewerObservers: IntersectionObserver[] = []
let isLeaving = false
const keepPosterFallback = (canvas: HTMLCanvasElement) => {
  const status = canvas?.closest('.webgl-shell')?.querySelector<HTMLElement>('[data-webgl-status]')
  if (status) status.textContent = 'Poster CAO · WebGL indisponible'
}

if (!staticMode) canvases.forEach((canvas) => {
  const observer = new IntersectionObserver(([entry], viewerObserver) => {
      if (!entry.isIntersecting) return
      viewerObserver.disconnect()
      void import('./webgl/RobotScene').then(({ RobotScene: Scene }) => {
        if (isLeaving) return
        try {
          robotScenes.push(new Scene(canvas, { reducedMotion: prefersReducedMotion() }))
        } catch {
          keepPosterFallback(canvas)
        }
      }).catch(() => keepPosterFallback(canvas))
    }, { rootMargin: '125% 0px' })
  viewerObservers.push(observer)
  observer.observe(canvas)
})

window.addEventListener('pagehide', () => {
  isLeaving = true
  viewerObservers.forEach((observer) => observer.disconnect())
  disposeDeck()
  disposePresentationMode()
  disposeObserverFigure()
  disposeCoordinationNarrative()
  disposeTrajectoryNarrative()
  disposeRuntimeNarrative()
  disposeResultsNarrative()
  disposeIndustrialContext()
  disposeSmedChallenge()
  robotScenes.forEach((scene) => scene.dispose())
}, { once: true })
