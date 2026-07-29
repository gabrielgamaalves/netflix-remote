import { FiberElement, type Fiber, type ReactElement } from "@lib/react-fiber.js"
import toUndefinedIfNaN from "@utils/toUndefinedIfNaN.js"

export class CarouselItem {
  element?: Element

  _fiber?: Fiber | undefined
  _react?: {
    wrappedItem: ReactElement
  }

  itemIndex?: number | undefined
  virtualSlot?: number | undefined

  // viewportIndex?: number | undefined
  // viewportPosition?: "leftPeek" | "leftEdge" | "middle" | "rightEdge" | "rightPeek"

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

  _isValid: boolean = false

  constructor(element: HTMLElement) {
    this.build(element)
  }

  get hasLinkedElement() { return this?.element?.isConnected && !!((this._fiber?.ref as any)?.current) }
  // syncIfMounted() { if (!this.hasLinkedElement) this.build() }

  build(element: HTMLElement) {
    if (!element || !(!!(element.dataset?.virtualSlot))) { this._isValid = false; return false } else { this._isValid = true }
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

    return true
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

  private get visibleItemsCount() {
    if (!this.element) return undefined

    const visibleItemsCount: number = Number(getComputedStyle(this.element).getPropertyValue('--slot-width').slice(-2, -1));
    return visibleItemsCount
  }

  get viewportIndex() {
    if (!this.element || !this.virtualSlot) return undefined

    const parent = this.element.parentNode
    if (!parent) return undefined

    const index = this.virtualSlot;
    const visibleItemsCount = this.visibleItemsCount as number

    const viewportIndex = index - visibleItemsCount

    return (viewportIndex >= 0 && viewportIndex <= (visibleItemsCount + 1)) ? viewportIndex : undefined
  }

  get viewportPosition() {
    const viewportIndex = this.viewportIndex
    if (viewportIndex === undefined) return undefined

    const visibleItemsCount = this.visibleItemsCount as number

    switch (viewportIndex) {
      case 0:
        return "leftPeek";
      case 1:
        return "leftEdge";

      case visibleItemsCount:
        return "rightEdge"
      case visibleItemsCount + 1:
        return "rightPeek"

      default:
        return "middle"
    }
  }
}

// window.scrollTo({
//   top: ,
//   behavior: "smooth"
// })


// var ca = new __Carousel(8)
// window.scrollTo({
//   top: (ca.element.offsetTop - (ca.element.getBoundingClientRect().height)),
// 	behavior: "smooth"
// })