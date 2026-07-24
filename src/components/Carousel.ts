import { FiberElement, type ReactElement, type ReactNode, type Fiber } from "@lib/react-fiber.js";

export class Carousel {
  readonly rowIndex: string | number
  // readonly options?: {
  //   force_link_react?: boolean
  // }

  element?: Element
  id?: string

  title: string | undefined

  _fiber?: Fiber | undefined
  _react?: {
    provider: Fiber | null | undefined,
    slider: ReactElement | null | undefined
  }

  constructor(rowIndex: string | number) {
    this.rowIndex = rowIndex
    // this.options = options

    this.build()
  }

  get hasLinkedElement() { return this?.element?.isConnected && !!((this._fiber?.ref as any)?.current) }
  syncIfMounted() { if (!this.hasLinkedElement) this.build() }

  build() {
    const element = document.body.querySelector(`[data-uia="carousel-row-section-${this.rowIndex}"]`) // (issues) -> mudar isso para melhor aproveitamento e organização do row
    if (!element) return false

    this.element = element
    this.id = element.id

    this.title = element.querySelector("p")?.innerText

    this.buildReact()
  }

  private buildReact() {
    this._fiber = this.getFiberFromElement()
    this._react = this.reactFromElement()
  }

  private getFiberFromElement() {
    if (!this.element) return
    return new FiberElement(this.element as HTMLElement)
  }

  private reactFromElement() {
    if (!this._fiber) return { provider: undefined, slider: undefined }
    return {
      provider: this?._fiber?.return?.return,
      slider: ((this?._fiber?.return?.return?.return?.return?.memoizedProps?.children as ReactNode[])[1] as ReactElement).props?.children[1]
    }
  }

  get totalItems(): number {
    this.syncIfMounted()
    return Number(this._react?.slider?.props.totalCount)
  }
  get totalPages(): number {
    this.syncIfMounted()
    return Number(this._react?.provider?.memoizedProps?.value.pageCount)
  }

  get totalItemsLoaded(): number {
    const slider = ((this._react?.provider?.return?.return?.memoizedProps?.children as ReactNode[])[1] as ReactElement).props?.children[1]
    return slider?.props?.children?.length || 0
  }
  get hasLoadedAllItems() {
    return this.totalItemsLoaded === this.totalItems
  }

  get selectedPageIndex(): number {
    this.syncIfMounted()

    const selectedElement = this.element?.querySelector('[data-uia="carousel-page-indicator"] [data-indicator-selected="true"]')
    if (!selectedElement) return -1;

    const parent = selectedElement.parentNode;
    if (!parent) return -1;

    return Array.from(parent.children).indexOf(selectedElement);
  }

  get visibleItemsCount(): number {
    this.syncIfMounted()

    const scroller = this.element?.querySelector('[data-uia="carousel-scroller"] div div') as Element
    return Number(getComputedStyle(scroller).getPropertyValue('--slot-width').slice(-2, -1))
  }

  getCarouselItems() {
    this.syncIfMounted()

    const scroller = this.element?.querySelector('[data-uia="carousel-scroller"] div div')
    const items = Array.from(scroller?.querySelectorAll("[data-virtual-slot]") || []);

    return items
  }

  previousPage() {
    return this._react?.provider?.memoizedProps?.value.previousPage()
  }

  nextPage() {
    return this._react?.provider?.memoizedProps?.value.nextPage()  
  }
}

// export class Carousel {
//   readonly rowIndex: string | number

//   _fiber?: FiberElement | undefined
//   _provider?: Fiber | null | undefined
//   _slider?: ReactElement | null | undefined

//   constructor(rowIndex: string | number) {
//     this.rowIndex = rowIndex
//     this.build()
//   }

//   get totalItems() { return this?._slider?.props.totalCount }
//   get totalPages() { return this?._provider?.memoizedProps?.value.pageCount }

//   getCarouselItems() {
//     return this?._slider?.props.children
//   }

//   getItemsId() {
//     return (((this?._provider?.return?.return?.return?.memoizedProps?.children as ReactNode[])[0] as any)[0] as ReactElement).props?.unifiedEntityIds
//   }

//   previousPage() {
//     return this?._provider?.memoizedProps?.value.previousPage()
//   }

//   nextPage() {
//     return this?._provider?.memoizedProps?.value.nextPage()
//   }

//   reload() {
//     return this.build()
//   }

//   get isLinkedComponent() { return !!((this._fiber?.ref as any)?.current) }

//   private build() {
//     const element = document.body.querySelector(
//       `[data-uia="carousel-row-section-${this.rowIndex}"]` // (issues) -> mudar isso para melhor aproveitamento e organização do row
//     )
//     if (!element) return false

//     this._fiber = new FiberElement(element as HTMLElement);

//     this._provider = this._fiber.return?.return
//     this._slider = ((this?._provider?.return?.return?.memoizedProps?.children as ReactNode[])[1] as ReactElement).props?.children[1]

//     return true
//   }
// }