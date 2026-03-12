export class SampleCardsManager {
  constructor(carousel) {
    this.carousel = carousel

    const queryCards = this.get()
    this.cards = (queryCards.length < 5) ?
      this.set(this.findIntialSampleCard("0", false)) :
      this.toJSON(queryCards)
  }

  get() {
    return [...this.carousel?.querySelectorAll(`.slider-item[data-c]`)]
  }

  toJSON(arrayCards) {
    const cards = {};
    arrayCards.forEach((card) => {
      cards[`${card.getAttribute("data-c")}`] = card;
    })

    return cards
  }

  findIntialSampleCard(sliderItemIndex = "0", ignoreDatac = true) {
    const sliderItem = this.carousel.querySelector(`.slider-item.slider-item-${sliderItemIndex}`)
    return (ignoreDatac) ? sliderItem : this.get().find(e => e?.getAttribute("data-c") === "0") || sliderItem
  }

  set(cardElem, datacDescarted) {
    if (datacDescarted && this.cards?.[datacDescarted]) {
      this.cards[datacDescarted].removeAttribute("data-c")
    }

    cardElem.setAttribute("data-c", "0")

    cardElem?.previousElementSibling?.previousElementSibling?.setAttribute("data-c", "-2")
    cardElem?.previousElementSibling?.setAttribute("data-c", "-1")

    cardElem?.nextElementSibling?.setAttribute("data-c", "1")
    cardElem?.nextElementSibling?.nextElementSibling?.setAttribute("data-c", "2")

    const cards = this.get()
    this.cards = this.toJSON(cards); // get from document

    cards.forEach(card => {
      const sliderRefocus = card.querySelector("a")
      if (!sliderRefocus || sliderRefocus.classList.contains("slider-refocus-disable")) return
      sliderRefocus.className = "slider-refocus-disable"
    })

    return this.cards
  }

  removeAllDatac() {
    Object.entries(this.cards).forEach(([pos, card]) => {
      card.removeAttribute("data-c")
    })
  }
}

export class ActionsCarousel {
  constructor(carousel) {
    this.carousel = carousel
    this.sampleCardsManager = new SampleCardsManager(this.carousel)
  }

  async advanceNextCard() {
    const sampleCardsManager = this.sampleCardsManager

    if (!(sampleCardsManager.cards["2"]?.classList[1]?.split("-")?.[2]))
      this.carousel.querySelector(".handle.handleNext.active").click()

    return await new Promise(function (resolve) {
      setTimeout(() => {
        const errNextCard = (!sampleCardsManager?.cards["0"]?.classList[1]?.split("-")?.[2] || !sampleCardsManager?.cards["1"]?.parentNode)
        if (errNextCard)
          sampleCardsManager.removeAllDatac()

        resolve(sampleCardsManager.set(
          (errNextCard) ?
            sampleCardsManager.findIntialSampleCard("1") :
            sampleCardsManager.cards["1"]
          , "-2"))
      }, 100)
    })
  }

  async advancePreviousCard() {
    const sampleCardsManager = this.sampleCardsManager
    const cardsLength = Object.keys(sampleCardsManager.cards).length

    if (cardsLength < 4) return;
    if (cardsLength === 5 && !(sampleCardsManager.cards["-2"]?.classList[1]?.split("-")?.[2]))
      this.carousel.querySelector(".handle.handlePrev.active").click();

    return await new Promise(function (resolve) {
      setTimeout(() => {
        const errNextCard = (!sampleCardsManager?.cards["0"]?.classList[1]?.split("-")?.[2] || !sampleCardsManager?.cards["-1"]?.parentNode)
        if (errNextCard)
          sampleCardsManager.removeAllDatac()

        resolve(sampleCardsManager.set(
          (errNextCard) ?
            sampleCardsManager.findIntialSampleCard("5") :
            sampleCardsManager.cards["-1"]
          , "2"))
      }, 100)
    })
  }
}