import { NavigationSelector } from "@shared/NavigationSelector.js";
import { NavigationCarousel, type ItemSelectionHooks } from "./carousel.js";

export type CarouselSelectionHooks<T = NavigationCarousel> = {
  onCarouselSelected?: (carousel: T) => void
  onCarouselDeselected?: (carousel: T) => void
}

export type OptionsNavigationCarouselCollection = {
  maxCacheSize: number,
  hooks: CarouselSelectionHooks
  itemsHooks?: ItemSelectionHooks
}

export const defaultHooks: Required<CarouselSelectionHooks> = {
  onCarouselSelected: (navCarousel) => {
    const element = navCarousel.carousel.element!
    element.setAttribute("data-carousel-selected", "true")

    window.scrollTo({
      top: (element.offsetTop - element.getBoundingClientRect().height),
      behavior: "smooth"
    })
  },
  onCarouselDeselected: (navCarousel) => {
    navCarousel.carousel.element?.removeAttribute("data-carousel-selected")
  },
}

export class NavigationCarouselCollection extends NavigationSelector<NavigationCarousel, CarouselSelectionHooks>{
  readonly maxCacheSize: number
  itemHooks: ItemSelectionHooks

  cache: Map<number, NavigationCarousel>

  selectedCarouselIndex: number = 0
  selectedCarousel?: NavigationCarousel

  _isMounted: boolean = true

  constructor(startCarousel: number, options?: OptionsNavigationCarouselCollection) {
    super(defaultHooks, options)

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

    this.deselectCarouselByIndex(this.selectedCarouselIndex)

    this.selectedCarouselIndex = carouselIndex
    this.selectedCarousel = targetCarousel

    this.cacheCarousel(carouselIndex, targetCarousel)

    this.hooks.onCarouselSelected(this.selectedCarousel)

    return targetCarousel
  }

  deselectCarouselByIndex(carouselIndex: number) {
    if (!this.cache.has(carouselIndex)) return false

    const cachedCarousel = this.cache.get(carouselIndex)
    if (cachedCarousel) this.hooks.onCarouselDeselected(cachedCarousel)

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