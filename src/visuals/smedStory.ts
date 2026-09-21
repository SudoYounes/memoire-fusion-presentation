type SlideActivation = CustomEvent<{ id: string; direction: number }>

type StoryScene = {
  element: HTMLElement
  steps: Set<number>
  hidden: HTMLElement['hidden']
  inert: boolean
  ariaHidden: string | null
}

type StorySlide = {
  element: HTMLElement
  count: number
  step: number
  scenes: StoryScene[]
  controls: HTMLElement[]
  counters: HTMLElement[]
  initialStep: string | undefined
  initialTabindex: string | null
}

const navigationControls = '[data-smed-goto], [data-smed-prev], [data-smed-next]'
const interactiveControls = 'a, button, input, textarea, select, [contenteditable="true"], [role="slider"], [role="listbox"]'

/** Local narration states; the deck retains ownership of slide transitions. */
export function mountSmedStory(): () => void {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('.smed-story-slide[data-smed-story][data-smed-steps]'))
  if (!elements.length) return () => {}

  const params = new URLSearchParams(window.location.search)
  const layout = window.matchMedia('(min-aspect-ratio: 4 / 5)')
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const preview = params.has('capture') || params.has('print')
  const requestedId = params.get('capture') || window.location.hash.slice(1) || elements[0].id
  const requestedStep = params.has('smed-step') ? Number(params.get('smed-step')) : NaN
  const live = document.querySelector<HTMLElement>('[data-deck-live]')
  const deckSlides = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'))
  const animations = new Map<HTMLElement, Animation>()
  const initialControls = new Map<HTMLElement, string | null>()
  const initialCounters = new Map<HTMLElement, string | null>()
  let alive = true
  let initialLayout = true
  let startupFrame = 0
  let printing = false
  let wheelLockedUntil = 0
  let lastWheelAt = -Infinity

  const stories: StorySlide[] = elements.map(element => {
    const declaredCount = Number(element.dataset.smedSteps)
    const count = Number.isInteger(declaredCount) && declaredCount > 0 ? declaredCount : 1
    const controls = Array.from(element.querySelectorAll<HTMLElement>('[data-smed-goto]'))
    const counters = Array.from(element.querySelectorAll<HTMLElement>('[data-smed-count]'))
    controls.forEach(control => initialControls.set(control, control.getAttribute('aria-current')))
    counters.forEach(counter => initialCounters.set(counter, counter.textContent))
    return {
      element,
      count,
      step: Number.isInteger(requestedStep) && element.id === requestedId
        ? Math.max(0, Math.min(count - 1, requestedStep)) : 0,
      scenes: Array.from(element.querySelectorAll<HTMLElement>('[data-smed-scene]'), scene => ({
        element: scene,
        steps: new Set((scene.dataset.smedScene ?? '').split(',').map(value => value.trim()).filter(Boolean).map(Number).filter(Number.isInteger)),
        hidden: scene.hidden,
        inert: scene.inert,
        ariaHidden: scene.getAttribute('aria-hidden'),
      })),
      controls,
      counters,
      initialStep: element.dataset.smedStep,
      initialTabindex: element.getAttribute('tabindex'),
    }
  })

  const noMotion = () => preview || printing || motion.matches || params.get('motion') === 'off'
  const activeStory = () => stories.find(story => story.element.classList.contains('is-active'))
  const settled = (story: StorySlide) => !layout.matches || Math.abs(story.element.getBoundingClientRect().top) < 3
  const cancelAnimations = () => {
    animations.forEach(animation => animation.cancel())
    animations.clear()
  }
  const focusStory = (story: StorySlide) => {
    const control = story.controls.find(item => Number(item.dataset.smedGoto) === story.step && !item.closest('[hidden], [inert]'))
    if (control) control.focus({ preventScroll: true })
    else {
      if (!story.element.hasAttribute('tabindex')) story.element.tabIndex = -1
      story.element.focus({ preventScroll: true })
    }
  }
  const setStep = (story: StorySlide, next: number, animate = true, announce = true) => {
    if (!Number.isInteger(next)) return
    story.step = Math.max(0, Math.min(story.count - 1, next))
    story.element.dataset.smedStep = String(story.step)
    const focused = document.activeElement
    let focusHidden = false
    story.scenes.forEach(scene => {
      animations.get(scene.element)?.cancel()
      animations.delete(scene.element)
      const visible = scene.steps.has(story.step)
      const entering = visible && scene.element.hidden
      if (!visible && focused && scene.element.contains(focused)) focusHidden = true
      scene.element.hidden = !visible
      scene.element.inert = !visible
      scene.element.setAttribute('aria-hidden', String(!visible))
      if (entering && animate && !noMotion() && typeof scene.element.animate === 'function') {
        const animation = scene.element.animate([
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 320, easing: 'cubic-bezier(.22, 1, .36, 1)' })
        animations.set(scene.element, animation)
        animation.onfinish = () => {
          if (animations.get(scene.element) === animation) animations.delete(scene.element)
        }
      }
    })
    story.controls.forEach(control => {
      if (Number(control.dataset.smedGoto) === story.step) control.setAttribute('aria-current', 'step')
      else control.removeAttribute('aria-current')
    })
    story.counters.forEach(counter => { counter.textContent = `${String(story.step + 1).padStart(2, '0')} / ${String(story.count).padStart(2, '0')}` })
    if (focusHidden) {
      if (announce) focusStory(story)
      else if (focused instanceof HTMLElement) focused.blur()
    }
    if (announce && live) {
      const captions = [...new Set(story.scenes.filter(scene => !scene.element.hidden).map(scene => scene.element.dataset.smedCaption).filter(Boolean))]
      live.textContent = `${story.element.dataset.title ?? 'SMED'}, étape ${story.step + 1} sur ${story.count}.${captions.length ? ` ${captions.join(' ')}` : ''}`
    }
  }

  const advance = (story: StorySlide, direction: number) => {
    const next = story.step + direction
    if (next >= 0 && next < story.count) {
      setStep(story, next)
      return
    }
    const destination = deckSlides.indexOf(story.element) + direction
    if (destination < 0 || destination >= deckSlides.length) return
    const rail = document.querySelector<HTMLButtonElement>(`[data-deck-index="${destination}"]`)
    if (!rail) return
    const focused = document.activeElement
    if (focused instanceof HTMLElement && (story.element.contains(focused) || focused.closest('.presenter-dock, .presenter-launch'))) focused.blur()
    rail.click()
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>(navigationControls) : null
    if (!target) return
    const story = stories.find(item => item.element === target.closest('.smed-story-slide'))
    if (!story || target.closest('[hidden], [inert]')) return
    event.preventDefault()
    if (target.hasAttribute('data-smed-goto')) setStep(story, Number(target.dataset.smedGoto))
    else advance(story, target.hasAttribute('data-smed-next') ? 1 : -1)
  }

  const onKey = (event: KeyboardEvent) => {
    const story = activeStory()
    if (!story || preview || printing || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    const target = event.target instanceof Element ? event.target : null
    const interactive = target?.closest(interactiveControls)
    const localControl = interactive?.matches(navigationControls) && story.element.contains(interactive)
    const presenterControl = interactive?.matches('.presenter-launch, [data-presenter-previous], [data-presenter-next], [data-presenter-exit]')
    if (interactive && !localControl && !presenterControl) return
    const forward = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey)
    const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey)
    if (!forward && !backward) return
    event.preventDefault()
    event.stopImmediatePropagation()
    if (event.repeat || !settled(story)) return
    advance(story, forward ? 1 : -1)
  }

  const onWheel = (event: WheelEvent) => {
    const story = activeStory()
    if (!story || preview || printing || !layout.matches || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    if (event.target instanceof Element && event.target.closest('[data-lenis-prevent], input, textarea, select, [contenteditable="true"]')) return
    const now = performance.now()
    const continuingGesture = now - lastWheelAt < 190
    lastWheelAt = now
    if (now < wheelLockedUntil || continuingGesture) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    if (!settled(story)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    wheelLockedUntil = now + 720
    advance(story, Math.sign(event.deltaY))
  }

  const onActive = (event: Event) => {
    const detail = (event as SlideActivation).detail
    cancelAnimations()
    const story = stories.find(item => item.element.id === detail.id)
    if (!story || preview || initialLayout) return
    setStep(story, detail.direction < 0 ? story.count - 1 : 0, false, false)
  }
  const onBeforePrint = () => { printing = true; cancelAnimations() }
  const onAfterPrint = () => { printing = false }
  const onLayout = () => { cancelAnimations(); wheelLockedUntil = 0; lastWheelAt = -Infinity }

  stories.forEach(story => {
    setStep(story, story.step, false, false)
    story.element.addEventListener('click', onClick)
  })
  window.addEventListener('keydown', onKey, true)
  window.addEventListener('wheel', onWheel, { capture: true, passive: false })
  window.addEventListener('deck:slide-active', onActive)
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)
  motion.addEventListener('change', cancelAnimations)
  layout.addEventListener('change', onLayout)
  void document.fonts.ready.then(() => {
    if (!alive) return
    startupFrame = requestAnimationFrame(() => {
      startupFrame = requestAnimationFrame(() => { initialLayout = false })
    })
  })

  return () => {
    alive = false
    cancelAnimationFrame(startupFrame)
    cancelAnimations()
    window.removeEventListener('keydown', onKey, true)
    window.removeEventListener('wheel', onWheel, true)
    window.removeEventListener('deck:slide-active', onActive)
    window.removeEventListener('beforeprint', onBeforePrint)
    window.removeEventListener('afterprint', onAfterPrint)
    motion.removeEventListener('change', cancelAnimations)
    layout.removeEventListener('change', onLayout)
    stories.forEach(story => {
      story.element.removeEventListener('click', onClick)
      if (story.initialStep === undefined) delete story.element.dataset.smedStep
      else story.element.dataset.smedStep = story.initialStep
      if (story.initialTabindex === null) story.element.removeAttribute('tabindex')
      else story.element.setAttribute('tabindex', story.initialTabindex)
      story.scenes.forEach(scene => {
        scene.element.hidden = scene.hidden
        scene.element.inert = scene.inert
        if (scene.ariaHidden === null) scene.element.removeAttribute('aria-hidden')
        else scene.element.setAttribute('aria-hidden', scene.ariaHidden)
      })
    })
    initialControls.forEach((value, control) => {
      if (value === null) control.removeAttribute('aria-current')
      else control.setAttribute('aria-current', value)
    })
    initialCounters.forEach((value, counter) => { counter.textContent = value })
  }
}
