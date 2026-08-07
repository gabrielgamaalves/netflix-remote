import type { NavigationCarouselCollection } from "@navigation/carouselCollection.js"
import type { NavigationHandlers } from "@shared/NavigatorSelector.js"

const scrollToCarousel = (navigation: any) => {
  const element = navigation.selectedCarousel.carousel.element!
  window.scrollTo({
    top: (element.offsetTop - element.getBoundingClientRect().height),
    behavior: "smooth"
  })
}

export const carouselCollectionEventsHandlers: NavigationHandlers<NavigationCarouselCollection> = {
  KEY_UP: (navigation, navigator) => {
    if (navigation.selectedCarouselIndex <= 1) return navigator.previousNavigation();

    navigation.previousCarousel()
    scrollToCarousel(navigation)
  },
  KEY_DOWN: (navigation, navigator) => {
    navigation.nextCarousel()
    scrollToCarousel(navigation)
  },
  KEY_RIGHT: async (navigation, navigator) => {
    await navigation.selectedCarousel?.nextItem()
  },
  KEY_LEFT: async (navigation, navigator) => {
    await navigation.selectedCarousel?.previousItem()
  },
  KEY_ENTER: (navigation, navigator) => {
    alert("finge que clicou!")
  },
}
