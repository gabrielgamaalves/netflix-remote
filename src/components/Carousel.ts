import { FiberElement, type ReactElement, type ReactNode, type Fiber } from "@lib/react-fiber.js";
import waitForTransitionEnd from "@utils/waitForTransitionEnd.js";
import { CarouselItem } from "./CarouselItem.js";

export class Carousel {
  readonly rowIndex: string | number
  // readonly options?: {
  //   force_link_fiberRefs?: boolean
  // }

  element?: HTMLElement
  id?: string

  title: string | undefined

  _fiber?: Fiber | undefined
  _fiberRefs?: {
    provider: Fiber | null | undefined,
    slider: ReactElement | null | undefined
  }

  _domRefs?: {
    scroller: HTMLElement | null | undefined
    scrollTrack: HTMLElement | null
  }

  _isMounted: boolean = false

  constructor(rowIndex: string | number) {
    this.rowIndex = rowIndex
    // this.options = options

    this.mount()
  }

  get hasLinkedElement(): boolean { return !!(this?.element?.isConnected) && !!((this._fiber?.ref as any)?.current) }
  refreshIfNeeded() { if (!this.hasLinkedElement) this.mount() }

  mount() {
    const element = document.body.querySelector(`[data-uia="carousel-row-section-${this.rowIndex}"]`) // (issues) -> mudar isso para melhor aproveitamento e organização do row
    if (!element) { this._isMounted = false; return false } else { this._isMounted = true }

    this.element = element as HTMLElement
    this.id = element.id

    this.title = element.querySelector("p")?.innerText

    this.resolveDomReferences()
    this.resolveFiberReferences()

    return true
  }

  private resolveDomReferences() {
    const scroller = this.element?.querySelector('[data-uia="carousel-scroller"]') as HTMLElement | null ?? null
    const scrollTrack = scroller?.querySelector('div div') as HTMLElement | null ?? null

    this._domRefs = { scroller, scrollTrack }
  }

  private resolveFiberReferences() {
    if (!this._isMounted) return undefined
    this._fiber = new FiberElement(this.element as HTMLElement)

    /* -> FiberRefs */
    if (!this._fiber) return { provider: undefined, slider: undefined }

    const provider = this?._fiber?.return?.return
    this._fiberRefs  = {
      provider: provider,
      slider: ((provider?.return?.return?.memoizedProps?.children as ReactNode[])[1] as ReactElement).props?.children[1]
    }
  }

  get totalItems(): number | undefined {
    if (!this._isMounted) return undefined

    this.refreshIfNeeded()
    return Number(this._fiberRefs?.slider?.props.totalCount)
  }
  get totalPages(): number | undefined {
    if (!this._isMounted) return undefined

    this.refreshIfNeeded()
    return Number(this._fiberRefs?.provider?.memoizedProps?.value.pageCount)
  }

  get totalItemsLoaded(): number | undefined {
    if (!this._isMounted) return undefined

    const slider = ((this._fiberRefs?.provider?.return?.return?.memoizedProps?.children as ReactNode[])[1] as ReactElement).props?.children[1]
    return slider?.props?.children?.length || 0
  }
  get allItemsLoaded() {
    if (!this._isMounted) return undefined
    return this.totalItemsLoaded === this.totalItems
  }

  get currentPageIndex(): number | undefined {
    if (!this._isMounted) return undefined

    this.refreshIfNeeded()

    const selectedElement = this.element?.querySelector('[data-uia="carousel-page-indicator"] [data-indicator-selected="true"]')
    if (!selectedElement) return -1;

    const parent = selectedElement.parentNode;
    if (!parent) return -1;

    return Array.from(parent.children).indexOf(selectedElement);
  }

  get visibleItemsCount(): number | undefined {
    if (!this._isMounted || !this._domRefs?.scrollTrack) return undefined

    this.refreshIfNeeded()
    return Number(getComputedStyle(this._domRefs?.scrollTrack).getPropertyValue('--slot-width').slice(-2, -1))
  }

  getCarouselItems() {
    if (!this._isMounted) return undefined

    this.refreshIfNeeded()

    const items = Array.from(this._domRefs?.scrollTrack?.querySelectorAll("[data-virtual-slot]") || []);
    return items.map((item) => new CarouselItem(item as HTMLElement))
  }


  previousPage() {
    if (!this._isMounted) return undefined

    this.refreshIfNeeded()
    return this._fiberRefs?.provider?.memoizedProps?.value.previousPage()
  }

  nextPage() {
    if (!this._isMounted) return undefined

    this.refreshIfNeeded()
    return this._fiberRefs?.provider?.memoizedProps?.value.nextPage()
  }


  async previousPageAsync() {
    if (!this._isMounted || !this._domRefs?.scrollTrack) return undefined

    this.previousPage()
    return await waitForTransitionEnd(this._domRefs?.scrollTrack)
  }

  async nextPageAsync() {
    if (!this._isMounted || !this._domRefs?.scrollTrack) return undefined

    this.nextPage()
    return await waitForTransitionEnd(this._domRefs?.scrollTrack)
  }
}