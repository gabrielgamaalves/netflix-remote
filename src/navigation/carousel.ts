import { Carousel, CarouselItem } from "@components/Carousel.js";

export class NavigationCarousel {
  carousel: Carousel
  id: string

  selectedCardIndex: number
  selectedPageIndex: number

  selectedCard?: CarouselItem | undefined

  constructor(rowIndex: string | number) {
    this.carousel = new Carousel(rowIndex)

    if (!this.carousel.element) {
      throw new Error("O Carousel não foi encontrado")
    }

    this.id = this.carousel.element.id

    this.selectedCardIndex = 0
    this.selectedPageIndex = 0

    this.selectCard(this.selectedCardIndex)
  }

  nextItem() {
    return this.selectCard(this.selectedCardIndex + 1)
  }
  previousItem() {
    return this.selectCard(this.selectedCardIndex - 1)
  }

  selectCard(itemIndex: number) {
    if (this.selectedCardIndex > 0 || this.selectedCardIndex < 0) this.deselectCard(this.selectedCardIndex)

    this.selectedCardIndex = itemIndex
    this.selectedCard = this.getCarouselItems()
      .find(item => item.itemIndex === itemIndex)

    return this.selectedCard
  }

  deselectCard(itemIndex: number) {
    console.log("finge que saiu a seleção do", itemIndex)
  }

  getCarouselItems() {
    const items = this.carousel.getCarouselItems()
    return items.map((item) => new CarouselItem(item as HTMLElement))
  }
}