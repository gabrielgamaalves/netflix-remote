import { FiberElement, type ReactElement, type ReactNode, type Fiber } from "@lib/react-fiber.js";
import toUndefinedIfNaN from "@utils/toUndefinedIfNaN.js";

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

  get totalItems() {
    this.syncIfMounted()
    return Number(this._react?.slider?.props.totalCount)
  }
  get totalPages() {
    this.syncIfMounted()
    return Number(this._react?.provider?.memoizedProps?.value.pageCount)
  }

  getCarouselItems() {
    const scroller = this.element?.querySelector('[data-uia="carousel-scroller"] div div')
    const items = Array.from(scroller?.querySelectorAll("[data-virtual-slot]") || []);

    return items
  }
}

export class CarouselItem {
  element?: Element

  _fiber?: Fiber | undefined
  _react?: {
    wrappedItem: ReactElement
  }

  itemIndex?: number | undefined
  virtualSlot?: number | undefined

  itemKey?: string;
  unifiedEntityId?: number;
  videoId?: number;

  playableInfo?: {
    videoId?: number;
    bookmarkPosition?: number;
    runtime?: number;
  };

  rank?: number;
  uiRanking?: number;
  rankingOpacity?: number;
  title?: string;

  image?: {
    key?: string;
    url?: string;
    width?: number;
    height?: number;
  };

  // imageCongruenceContext?: string;
  trackingClass?: Set<string>;
  maturityLevel?: string;

  typeCard?: "standard" | "ranked" | undefined

  constructor(element: HTMLElement) {
    this.build(element)
  }

  get hasLinkedElement() { return this?.element?.isConnected && !!((this._fiber?.ref as any)?.current) }
  // syncIfMounted() { if (!this.hasLinkedElement) this.build() }

  build(element: HTMLElement) {
    if (!element || !(!!(element.dataset?.virtualSlot))) return false
    this.element = element

    this.buildReact()
    // if (!this._react?.wrappedItem) return false

    this.itemIndex = this._react?.wrappedItem?.props?.itemIndex || toUndefinedIfNaN(Number(this._fiber?.return?.key))
    this.virtualSlot = toUndefinedIfNaN(Number(element.dataset.virtualSlot))

    this.itemKey = this._react?.wrappedItem?.props?.itemKey
    this.unifiedEntityId = this._react?.wrappedItem?.props?.unifiedEntityId
    this.videoId = this._react?.wrappedItem?.props?.videoId

    this.playableInfo = {
      videoId: this._react?.wrappedItem?.props?.playableInfo?.videoId,
      bookmarkPosition: this._react?.wrappedItem?.props?.playableInfo?.bookmarkPosition,
      runtime: this._react?.wrappedItem?.props?.playableInfo?.runtime,
    }

    this.rank = this._react?.wrappedItem?.props?.rank
    this.uiRanking = this._react?.wrappedItem?.props?.uiRanking
    this.rankingOpacity = this._react?.wrappedItem?.props?.rankingOpacity
    this.title = this._react?.wrappedItem?.props?.title

    this.image = {
      key: this._react?.wrappedItem?.props?.image?.key,
      url: this._react?.wrappedItem?.props?.image?.url,
      width: this._react?.wrappedItem?.props?.image?.width,
      height: this._react?.wrappedItem?.props?.image?.height,
    }

    // this.imageCongruenceContext = this._react?.wrappedItem.props?.imageCongruenceContext
    this.trackingClass = new Set(this._react?.wrappedItem?.props?.trackingClass.split(" "))
    this.maturityLevel = this._react?.wrappedItem?.props?.maturityLevel

    this.typeCard = this.trackingClass.size === 0 ? undefined : (this.trackingClass.has("standard-card") ? "standard" : "ranked");
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
    if (!this._fiber) return { wrappedItem: undefined }

    const { wrappedItem, itemIndex } = (this._fiber.memoizedProps?.children as ReactElement)?.props || {}
    if (wrappedItem?.props) wrappedItem.props.itemIndex = itemIndex

    return {
      wrappedItem
    }
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