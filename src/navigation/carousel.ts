import { NavigationSelector, type SelectionHooks } from "@shared/NavigationSelector.js";

import { Carousel } from "@components/Carousel.js";
import { CarouselItem } from "@components/CarouselItem.js";

export type OptionsNavigationCarousel = {
  hooks?: ItemSelectionHooks
}

export type LatestAction = "initialized" | "nextItem" | "previousItem" | "nextPageAndItem" | "previousPageAndItem"

export type ItemSelectionHooks = {
  onItemSelected?: (item: CarouselItem) => void
  onItemDeselected?: (item: CarouselItem) => void
}

export const defaultHooks: Required<ItemSelectionHooks> = {
  onItemSelected: (item) => {
    item.element?.setAttribute("data-card-selected", "true")
  },
  onItemDeselected: (item) => {
    item.element?.removeAttribute("data-card-selected")
  }
}

export class NavigationCarousel extends NavigationSelector<CarouselItem, ItemSelectionHooks> {
  carousel: Carousel
  id?: string

  latestAction?: LatestAction

  selectedItemIndex?: number
  selectedViewportIndex?: number

  selectedItem?: CarouselItem | undefined

  _isMounted: boolean = false

  constructor(rowIndex: string | number, options?: OptionsNavigationCarousel) {
    super(defaultHooks, options)

    this.carousel = new Carousel(rowIndex)
    this.mount()
  }

  mount() {
    const mounted = this.mountComponent(this.carousel)
    if (!mounted) return false

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

  async nextItem() {
    if (!this._isMounted) return undefined
    return await this.selectItem(this.selectedViewportIndex! + 1)
  }
  async previousItem() {
    if (!this._isMounted) return undefined
    return await this.selectItem(this.selectedViewportIndex! - 1)
  }

  async selectItem(viewportIndex: number): Promise<CarouselItem | undefined> {
    if (!this._isMounted) return undefined

    let latestPage = this.currentPageIndex

    let targetItem = this.getItemByViewportIndex(viewportIndex)
    let targetViewportIndex = viewportIndex

    let action: LatestAction = (viewportIndex === this.selectedViewportIndex) ? "initialized" : ((viewportIndex > (this.selectedViewportIndex!)) ? "nextItem" : "previousItem")

    this.deselectItemByIndex(this.selectedItemIndex!) /* or viewportIndex */

    if (targetItem?.viewportPosition === "leftPeek" && this.currentPageIndex === 0 && !this.carousel.allItemsLoaded) {
      return this.selectItem(targetViewportIndex + 1) /* Due to slowness when loading items, it hinders the item selection process. */
    }

    const peekDirection = targetItem?.viewportPosition
    if (peekDirection === "rightPeek" || peekDirection === "leftPeek") {
      const isForward = peekDirection === "rightPeek"

      await (isForward ? this.carousel.nextPageAsync() : this.carousel.previousPageAsync())
      await this.waitForFrame()

      action = isForward ? "nextPageAndItem" : "previousPageAndItem"

      targetItem = this.getItemByIndex(targetItem!.itemIndex!) /* Ensures that regardless of how many items are scrolled through, it will always select the next one. */
      targetViewportIndex = targetItem?.viewportIndex || (isForward ? 1 : this.carousel.visibleItemsCount!)
    }

    // Prevents the carousel from interfering with item selection if it returns to the beginning and gets reloaded.
    if (latestPage === (this.carousel.totalPages! - 1) && this.currentPageIndex === 0) {
      return this.waitForFrame(async () => {
        const selectedItem = await this.selectItem(targetViewportIndex)
        this.latestAction = "nextPageAndItem"
        return selectedItem
      })
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

  private waitForFrame<T = void>(callback?: () => T | Promise<T>): Promise<T> {
    return new Promise(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(async () => {
        resolve(callback ? await callback() : (undefined as T))
      }))
    })
  }
}