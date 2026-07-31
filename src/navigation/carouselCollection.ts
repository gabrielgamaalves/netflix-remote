import { NavigationCarousel } from "./carousel.js";

type CacheOptions = { maxCacheSize: number }

type CarouselSelectionHooks = {
  onCarouselSelected?: (carousel: NavigationCarousel) => void
  onCarouselDeselected?: (carousel: NavigationCarousel) => void
}

const defaultHooks: Required<CarouselSelectionHooks> = {
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
  }
}

export class NavigationCarouselCollection {
  options: CacheOptions | undefined
  hooks: Required<CarouselSelectionHooks>
  cache: Map<number, NavigationCarousel>

  selectedCarouselIndex: number = 0
  selectedCarousel?: NavigationCarousel

  constructor(startCarousel: number, options?: CacheOptions & CarouselSelectionHooks) {
    this.options = { maxCacheSize: options?.maxCacheSize ?? 3 }
    this.options.maxCacheSize = Math.max(this.options.maxCacheSize, 3)

    this.hooks = {
      onCarouselSelected: options?.onCarouselSelected ?? defaultHooks.onCarouselSelected,
      onCarouselDeselected: options?.onCarouselDeselected ?? defaultHooks.onCarouselDeselected,
    }

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
    let targetCarousel: NavigationCarousel;

    if (
      this.cache.has(carouselIndex) && this.cache.get(carouselIndex)?._isMounted
    ) {
      targetCarousel = this.cache.get(carouselIndex)!
    } else {
      targetCarousel = new NavigationCarousel(carouselIndex)
    }

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
    else if (this.cache.size >= this.options!.maxCacheSize) {
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