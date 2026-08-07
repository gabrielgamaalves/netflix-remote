import { NavigationSelector } from "@shared/NavigationSelector.js";
import { NavigationCarousel, type ItemSelectionHooks } from "./carousel.js";

export type OptionsNavigationCarouselCollection = {
  maxCacheSize?: number,
  hooks?: CarouselSelectionHooks
  itemsHooks?: ItemSelectionHooks
}

export type LatestAction = "initialized" | "nextCarousel" | "previousCarousel"

export type CarouselSelectionHooks<T = NavigationCarousel, C = NavigationCarouselCollection> = { /* (issues) -> carouselCollection existe sim! */
  onCarouselSelected?: (carousel: T, carouselCollection?: C) => void
  onCarouselDeselected?: (carousel: T, carouselCollection?: C) => void
}

export const CAROUSEL_SELECTED_DATASET = "data-carousel-selected"

export const defaultHooks: Required<CarouselSelectionHooks> = {
  onCarouselSelected: () => { },
  onCarouselDeselected: () => { },
}

export class NavigationCarouselCollection extends NavigationSelector<NavigationCarousel, CarouselSelectionHooks> {
  private readonly startCarousel: number

  readonly maxCacheSize: number
  itemHooks: ItemSelectionHooks

  latestAction: LatestAction = "initialized"

  cache: Map<number, NavigationCarousel>

  selectedCarouselIndex: number = 0
  selectedCarousel?: NavigationCarousel


  _isMounted: boolean = true

  constructor(startCarousel: number, options?: OptionsNavigationCarouselCollection) {
    super(defaultHooks, options)

    this.startCarousel = startCarousel;

    this.maxCacheSize = Math.max(options?.maxCacheSize ?? 3, 3)
    this.itemHooks = options?.itemsHooks || {}

    this.cache = new Map()
    this.selectCarousel(startCarousel)
  }

  previousCarousel() {
    return this.selectCarousel(this.selectedCarouselIndex - 1)
  }
  nextCarousel() {
    return this.selectCarousel(this.selectedCarouselIndex + 1)
  }

  selectCarousel(carouselIndex: number) {
    const targetCarousel = (this.cache.has(carouselIndex) && this.cache.get(carouselIndex)?._isMounted)
      ? this.cache.get(carouselIndex)!
      : new NavigationCarousel(carouselIndex, {
        hooks: this.itemHooks
      })

    if (!targetCarousel._isMounted) return this.selectedCarousel

    let action: LatestAction = (carouselIndex > (this.selectedCarouselIndex!)) ? "nextCarousel" : "previousCarousel"

    this.deselectCarouselByIndex(this.selectedCarouselIndex)

    this.selectedCarouselIndex = carouselIndex
    this.selectedCarousel = targetCarousel
    this.element = targetCarousel.element!

    this.cacheCarousel(carouselIndex, targetCarousel)

    this.latestAction = (
      action === "nextCarousel"
      && this.latestAction === "initialized"
      && (carouselIndex === this.startCarousel)
    ) ? "initialized" : action

    this.selectedCarousel?.carousel?.element?.setAttribute(CAROUSEL_SELECTED_DATASET, "true")
    this.hooks.onCarouselSelected(this.selectedCarousel, this)

    return targetCarousel
  }

  deselectCarouselByIndex(carouselIndex: number) {
    if (!this.cache.has(carouselIndex)) return false

    const cachedCarousel = this.cache.get(carouselIndex)

    cachedCarousel?.carousel?.element?.removeAttribute(CAROUSEL_SELECTED_DATASET)
    if (cachedCarousel) this.hooks.onCarouselDeselected(cachedCarousel, this)

    return true
  }

  cacheCarousel(key: number, value: NavigationCarousel) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }
    else if (this.cache.size >= this.maxCacheSize) {
      const leastRecentlyUsedKey = this.cache.keys().next().value
      if (leastRecentlyUsedKey === undefined) return undefined

      this.cache.delete(leastRecentlyUsedKey)
    }

    this.cache.set(key, value)
  }

  cachedCarousel(carouselIndex: number) {
    if (!this.cache.has(carouselIndex)) return undefined
    this.cache.delete(carouselIndex)
  }
}