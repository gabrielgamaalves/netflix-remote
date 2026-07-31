import { Carousel } from "@components/Carousel.js";
import { CarouselItem } from "@components/CarouselItem.js";

type LatestAction = "initialized" | "nextItem" | "previousItem" | "nextPageAndItem" | "previousPageAndItem"

type ItemSelectionHooks = {
  onItemSelected?: (item: CarouselItem) => void
  onItemDeselected?: (item: CarouselItem) => void
}

const defaultItemHooks: Required<ItemSelectionHooks> = {
  onItemSelected: (item) => {
    item.element?.setAttribute("data-card-selected", "true")
  },
  onItemDeselected: (item) => {
    item.element?.removeAttribute("data-card-selected")
  }
}

export class NavigationCarousel {
  carousel: Carousel
  hooks: Required<ItemSelectionHooks>

  id?: string

  latestAction?: LatestAction

  selectedItemIndex?: number
  selectedViewportIndex?: number

  selectedItem?: CarouselItem | undefined

  _isMounted: boolean = false

  constructor(rowIndex: string | number, options?: ItemSelectionHooks) {
    this.carousel = new Carousel(rowIndex) /* principio da hierarqui */
    this.hooks = {
      onItemSelected: options?.onItemSelected ?? defaultItemHooks.onItemSelected,
      onItemDeselected: options?.onItemDeselected ?? defaultItemHooks.onItemDeselected,
    }

    this.mount()
  }

  get hasLinkedElement() { return (this.carousel.hasLinkedElement) }

  mount() {
    if (!this.carousel._isMounted) { this._isMounted = false; return false } else { this._isMounted = true }

    this.latestAction = "initialized"

    this.id = this.carousel.element!.id
    this.selectedItemIndex = 0

    const viewportBySelectedCard = this.findViewportBySelectedCard()
    this.selectedViewportIndex = (viewportBySelectedCard > -1) ? viewportBySelectedCard : (1 /* leftEdge */)

    this.selectItem(this.selectedViewportIndex)

    return true
  }

  private findViewportBySelectedCard(): number {
    const selectedCardElement = this.carousel.element!.querySelector("[data-card-selected]") /* vai ter */

    if (!selectedCardElement) return -1

    const item = new CarouselItem(selectedCardElement as HTMLElement)

    const itemPage = (item.itemIndex! / this.carousel.visibleItemsCount!)
    const currentPage = this.carousel.currentPageIndex!

    if (
      !item._isMounted
      || !(itemPage >= currentPage) && (itemPage <= currentPage + 1)
    ) return -1

    return item.viewportIndex || -1
  }

  get currentPageIndex() {
    if (!this._isMounted) return undefined
    return this.carousel.currentPageIndex
  }

  async nextItem() {
    if (!this._isMounted) return undefined
    return await this.selectItem(this.selectedViewportIndex! + 1)
  }
  async previousItem() {
    if (!this._isMounted) return undefined
    return await this.selectItem(this.selectedViewportIndex! - 1)
  }

  getCarouselItems() {
    if (!this._isMounted) return undefined

    const items = this.carousel.getCarouselItems() || []
    return items
  }

  getItemByIndex(itemIndex: number) {
    if (!this._isMounted) return undefined
    return (this.getCarouselItems() as CarouselItem[]).find(item => item.itemIndex === itemIndex)
  }
  getItemByViewportIndex(viewportIndex: number) {
    if (!this._isMounted) return undefined
    return (this.getCarouselItems() as CarouselItem[]).find(item => item.viewportIndex === viewportIndex)
  }

  async selectItem(viewportIndex: number): Promise<CarouselItem | undefined> {
    if (!this._isMounted) return undefined

    let latestPage = this.currentPageIndex

    let targetItem = this.getItemByViewportIndex(viewportIndex)
    let targetViewportIndex = viewportIndex

    let action: LatestAction = (viewportIndex === this.selectedViewportIndex) ? "initialized" : ((viewportIndex > (this.selectedViewportIndex!)) ? "nextItem" : "previousItem")

    this.deselectItemByIndex(this.selectedItemIndex!) /* or viewportIndex */

    if (targetItem?.viewportPosition === "rightPeek") {
      await this.carousel.nextPageAsync()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      action = "nextPageAndItem"

      targetItem = this.getItemByIndex(targetItem.itemIndex!) /* Ensures that regardless of how many items are scrolled through, it will always select the next one. */
      targetViewportIndex = targetItem?.viewportIndex || 1
    }

    if (targetItem?.viewportPosition === "leftPeek") {
      if (this.currentPageIndex === 0 && !this.carousel.allItemsLoaded) return this.selectItem(targetViewportIndex + 1) /* Due to slowness when loading items, it hinders the item selection process. */

      await this.carousel.previousPageAsync()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      action = "previousPageAndItem"

      targetItem = this.getItemByIndex(targetItem.itemIndex!) /* Ensures that regardless of how many items are scrolled through, it will always select the next one. */
      targetViewportIndex = targetItem?.viewportIndex || this.carousel.visibleItemsCount!
    }

    // Prevents the carousel from interfering with item selection if it returns to the beginning and gets reloaded.
    if (latestPage === (this.carousel.totalPages! - 1) && this.currentPageIndex === 0) {
      return (
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(async () => {
          const selectItem = await this.selectItem(targetViewportIndex)
          this.latestAction = "nextPageAndItem"
          resolve(selectItem)
        })))
      )
    }

    this.latestAction = action

    this.selectedViewportIndex = targetViewportIndex
    this.selectedItem = targetItem

    this.selectedItemIndex = this.selectedItem?.itemIndex as number
    if (this.selectedItem) this.hooks.onItemSelected(this.selectedItem)

    return this.selectedItem
  }

  deselectItemByIndex(itemIndex: number) {
    const item = this.getItemByIndex(itemIndex)
    if (item) this.hooks.onItemDeselected(item)
  }
}