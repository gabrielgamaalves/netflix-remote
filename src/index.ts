
import { getFiberFromElement } from "@lib/react-fiber.js"

import { Carousel, CarouselItem } from "@components/Carousel.js"
import { NavigationCarousel } from "./navigation/carousel.js";
import toUndefinedIfNaN from "@utils/toUndefinedIfNaN.js";

Object.assign(window, {
  getFiberFromElement,
  toUndefinedIfNaN,
  
  __Carousel: Carousel,
  __CarouselItem: CarouselItem,
  __NavigationCarousel: NavigationCarousel
})

Object.assign(window, {
  carousel: new Carousel(5),
  nav_carousel: new NavigationCarousel(5)
})