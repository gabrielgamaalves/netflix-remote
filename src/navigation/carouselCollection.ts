import { NavigationCarousel } from "./carousel.js";

type options = { cacheSize: number }

export class NavigationCarouselCollection {
  options: options | undefined
  cache: Map<number, NavigationCarousel>

  selectedCarouselIndex: number = 0
  selectedCarousel?: NavigationCarousel

  constructor(startCarousel: number, options?: options) {
    this.options = options || { cacheSize: 3 }
    this.options.cacheSize = (this.options.cacheSize < 3) ? 3 : this.options.cacheSize

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
    let selectedCarousel: NavigationCarousel;

    if (
      this.cache.has(carouselIndex) && this.cache.get(carouselIndex)?._isValid
    ) {
      selectedCarousel = this.cache.get(carouselIndex)!
    } else {
      selectedCarousel = new NavigationCarousel(carouselIndex)
    }

    if (!selectedCarousel._isValid) return this.selectedCarousel

    this.deselectCarousel(this.selectedCarouselIndex)

    this.selectedCarouselIndex = carouselIndex
    this.selectedCarousel = selectedCarousel

    this.setCache(carouselIndex, selectedCarousel)

    this.selectedCarousel.carousel.element?.setAttribute("data-carousel-selected", "true")

    const carouselElement = this.selectedCarousel.carousel.element!
    window.scrollTo({
      top: (carouselElement.offsetTop - (carouselElement.getBoundingClientRect().height)),
      behavior: "smooth"
    })
    
    return selectedCarousel
  }

  deselectCarousel(carouselIndex: number) {
    if (!this.cache.has(carouselIndex)) return false

    const carousel = this.cache.get(carouselIndex)
    carousel?.carousel.element?.removeAttribute("data-carousel-selected")

    return true
  }

  setCache(key: number, value: NavigationCarousel) {
    if (this.cache.size >= this.options!.cacheSize) {
      this.deleteCache([...this.cache.keys()][0]!)
    }

    this.cache.set(key, value)
  }

  deleteCache(carouselIndex: number) {
    if (!this.cache.has(carouselIndex)) return undefined
    this.cache.delete(carouselIndex)
  }
}