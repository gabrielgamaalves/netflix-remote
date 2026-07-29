
import { getFiberFromElement } from "@lib/react-fiber.js"

import { Carousel } from "@components/Carousel.js"
import { CarouselItem } from "@components/CarouselItem.js"
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
  ca: new Carousel(3),
  nc: new NavigationCarousel(1)
})

// [data-card-selected="true"] {
  // border: 1.5px solid;
  // border-radius: 10px;
  // padding: 6px;
// }