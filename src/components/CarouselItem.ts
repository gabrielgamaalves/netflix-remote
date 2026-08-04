import { FiberElement, type Fiber, type ReactElement } from "@lib/react-fiber.js"
import toUndefinedIfNaN from "@utils/toUndefinedIfNaN.js"

export class CarouselItem {
  element?: Element

  _fiber?: Fiber | undefined
  _fiberRefs?: {
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

  cardType?: "standard" | "ranked" | undefined

  _isMounted: boolean = false

  constructor(element: HTMLElement) {
    this.mount(element)
  }

  get hasLinkedElement() { return this?.element?.isConnected && !!((this._fiber?.ref as any)?.current) }
  // syncIfMounted() { if (!this.hasLinkedElement) this.mount() }

  mount(element: HTMLElement) {
    if (!element || !(!!(element.dataset?.virtualSlot))) { this._isMounted = false; return false } else { this._isMounted = true }
    this.element = element

    this.resolveFiberReferences()
    // if (!this._fiberRefs?.wrappedItem) return false

    this.itemIndex = this._fiberRefs?.wrappedItem?.props?.itemIndex || toUndefinedIfNaN(Number(this._fiber?.return?.key))
    this.virtualSlot = toUndefinedIfNaN(Number(element.dataset.virtualSlot))

    this.itemKey = this._fiberRefs?.wrappedItem?.props?.itemKey
    this.unifiedEntityId = this._fiberRefs?.wrappedItem?.props?.unifiedEntityId
    this.videoId = this._fiberRefs?.wrappedItem?.props?.videoId

    this.playableInfo = {
      videoId: this._fiberRefs?.wrappedItem?.props?.playableInfo?.videoId,
      bookmarkPosition: this._fiberRefs?.wrappedItem?.props?.playableInfo?.bookmarkPosition,
      runtime: this._fiberRefs?.wrappedItem?.props?.playableInfo?.runtime,
    }

    this.rank = this._fiberRefs?.wrappedItem?.props?.rank
    this.uiRanking = this._fiberRefs?.wrappedItem?.props?.uiRanking
    this.rankingOpacity = this._fiberRefs?.wrappedItem?.props?.rankingOpacity
    this.title = this._fiberRefs?.wrappedItem?.props?.title

    this.image = {
      key: this._fiberRefs?.wrappedItem?.props?.image?.key,
      url: this._fiberRefs?.wrappedItem?.props?.image?.url,
      width: this._fiberRefs?.wrappedItem?.props?.image?.width,
      height: this._fiberRefs?.wrappedItem?.props?.image?.height,
    }

    // this.imageCongruenceContext = this._fiberRefs?.wrappedItem.props?.imageCongruenceContext
    this.trackingClass = new Set(this._fiberRefs?.wrappedItem?.props?.trackingClass.split(" "))
    this.maturityLevel = this._fiberRefs?.wrappedItem?.props?.maturityLevel

    this.cardType = this.trackingClass.size === 0 ? undefined : (this.trackingClass.has("standard-card") ? "standard" : "ranked");

    return true
  }

  private resolveFiberReferences() {
    if (!this._isMounted) return undefined
    this._fiber = new FiberElement(this.element as HTMLElement)

    /* -> FiberRefs */
    if (!this._fiber) return { wrappedItem: undefined }

    const { wrappedItem, itemIndex } = (this._fiber.memoizedProps?.children as ReactElement)?.props || {}
    if (wrappedItem?.props) wrappedItem.props.itemIndex = itemIndex

    this._fiberRefs = {
      wrappedItem
    }
  }

  private get visibleItemsCount() {
    if (!this._isMounted) return undefined

    const visibleItemsCount: number = Number(getComputedStyle(this.element!).getPropertyValue('--slot-width').slice(-2, -1));
    return visibleItemsCount
  }

  get viewportIndex() {
    if (!this._isMounted || !this.virtualSlot) return undefined

    const parent = this.element!.parentNode
    if (!parent) return undefined

    const index = this.virtualSlot;
    const visibleItemsCount = this.visibleItemsCount as number

    const viewportIndex = index - visibleItemsCount

    return (viewportIndex >= 0 && viewportIndex <= (visibleItemsCount + 1)) ? viewportIndex : undefined
  }

  get viewportPosition() {
    if (!this._isMounted) return undefined

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