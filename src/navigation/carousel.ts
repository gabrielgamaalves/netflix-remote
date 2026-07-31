import { Carousel } from "@components/Carousel.js";
import { CarouselItem } from "@components/CarouselItem.js";

type latestAction = "initialized" | "nextItem" | "previousItem" | "nextPage+nextItem" | "previousPage+previousItem"

export class NavigationCarousel {
  carousel: Carousel
  id?: string

  latestAction?: latestAction

  selectedItemIndex?: number
  selectedViewportIndex?: number

  selectedItem?: CarouselItem | undefined

  _isValid: boolean = false

  constructor(rowIndex: string | number) {
    this.carousel = new Carousel(rowIndex) /* principio da hierarqui */
    this.build()
  }

  get hasLinkedComponent() { return (this.carousel.hasLinkedElement) }

  build() {
    if (!this.carousel._isValid) { this._isValid = false; return false } else { this._isValid = true }

    this.id = this.carousel.element!.id

    this.selectedItemIndex = 0
    this.selectedViewportIndex = 1 /* leftEdge */

    this.latestAction = "initialized"

    this.selectItem(this.selectedViewportIndex)
    
    return true
  }

  get selectedPageIndex() {
    if (!this._isValid) return undefined
    return this.carousel.selectedPageIndex
  }

  async nextItem() {
    if (!this._isValid) return undefined
    return await this.selectItem(this.selectedViewportIndex! + 1)
  }
  async previousItem() {
    if (!this._isValid) return undefined
    return await this.selectItem(this.selectedViewportIndex! - 1)
  }

  getCarouselItems() {
    if (!this._isValid) return undefined

    const items = this.carousel.getCarouselItems() || []
    return items.map((item) => new CarouselItem(item as HTMLElement))
  }

  getItemByIndex(itemIndex: number) {
    if (!this._isValid) return undefined
    return (this.getCarouselItems() as CarouselItem[]).find(item => item.itemIndex === itemIndex)
  }
  getItemByViewportIndex(viewportIndex: number) {
    if (!this._isValid) return undefined
    return (this.getCarouselItems() as CarouselItem[]).find(item => item.viewportIndex === viewportIndex)
  }

  async selectItem(viewportIndex: number): Promise<CarouselItem | undefined> {
    if (!this._isValid) return undefined

    let latestPage = this.selectedPageIndex

    let nextItem = this.getItemByViewportIndex(viewportIndex)
    let nextViewportIndex = viewportIndex

    let action: latestAction = (viewportIndex === this.selectedViewportIndex) ? "initialized" : ((viewportIndex > (this.selectedViewportIndex!)) ? "nextItem" : "previousItem")

    this.deselectItem(this.selectedItemIndex!) /* or viewportIndex */

    if (nextItem?.viewportPosition === "rightPeek") {
      await this.carousel.nextPageAsync()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      action = "nextPage+nextItem"

      nextItem = this.getItemByIndex(nextItem.itemIndex!) /* Ensures that regardless of how many items are scrolled through, it will always select the next one. */
      nextViewportIndex = nextItem?.viewportIndex || 1
    }

    if (nextItem?.viewportPosition === "leftPeek") {
      if (this.selectedPageIndex === 0 && !this.carousel.hasLoadedAllItems) return this.selectItem(nextViewportIndex + 1) /* Due to slowness when loading items, it hinders the item selection process. */

      await this.carousel.previousPageAsync()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      action = "previousPage+previousItem"

      nextItem = this.getItemByIndex(nextItem.itemIndex!) /* Ensures that regardless of how many items are scrolled through, it will always select the next one. */
      nextViewportIndex = nextItem?.viewportIndex || this.carousel.visibleItemsCount!
    }

    // Prevents the carousel from interfering with item selection if it returns to the beginning and gets reloaded.
    if (latestPage === (this.carousel.totalPages! - 1) && this.selectedPageIndex === 0) {
      return (
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(async () => {
          const selectItem = await this.selectItem(nextViewportIndex)
          this.latestAction = "nextPage+nextItem"
          resolve(selectItem)
        })))
      )
    }

    this.latestAction = action

    this.selectedViewportIndex = nextViewportIndex
    this.selectedItem = nextItem

    this.selectedItemIndex = this.selectedItem?.itemIndex as number
    this.selectedItem?.element?.setAttribute("data-card-selected", "true")

    return this.selectedItem
  }

  deselectItem(itemIndex: number) {
    const item = this.getItemByIndex(itemIndex)
    item?.element?.removeAttribute("data-card-selected")
  }
}