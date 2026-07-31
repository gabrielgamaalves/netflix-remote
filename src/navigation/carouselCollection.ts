import { NavigationCarousel } from "./carousel.js";

type CacheOptions = { maxCacheSize: number }

export class NavigationCarouselCollection {
  options: CacheOptions | undefined
  cache: Map<number, NavigationCarousel>

  selectedCarouselIndex: number = 0
  selectedCarousel?: NavigationCarousel

  constructor(startCarousel: number, options?: CacheOptions) {
    this.options = options || { maxCacheSize: 3 }
    this.options.maxCacheSize = (this.options.maxCacheSize < 3) ? 3 : this.options.maxCacheSize

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

    this.deselectCarousel(this.selectedCarouselIndex)

    this.selectedCarouselIndex = carouselIndex
    this.selectedCarousel = targetCarousel

    this.cacheCarousel(carouselIndex, targetCarousel)

    this.selectedCarousel.carousel.element?.setAttribute("data-carousel-selected", "true")

    const carouselElement = this.selectedCarousel.carousel.element!
    window.scrollTo({
      top: (carouselElement.offsetTop - (carouselElement.getBoundingClientRect().height)),
      behavior: "smooth"
    })

    return targetCarousel
  }

  deselectCarousel(carouselIndex: number) {
    if (!this.cache.has(carouselIndex)) return false

    const carousel = this.cache.get(carouselIndex)
    carousel?.carousel.element?.removeAttribute("data-carousel-selected")

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