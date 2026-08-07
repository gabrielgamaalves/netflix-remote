
import { getFiberFromElement } from "@lib/react-fiber.js"
import toUndefinedIfNaN from "@utils/toUndefinedIfNaN.js";

import { Carousel } from "@components/Carousel.js"
import { CarouselItem } from "@components/CarouselItem.js"
import { Billboard } from "@components/Billboard.js";

import { NavigationCarousel } from "./navigation/carousel.js";
import { NavigationCarouselCollection } from "@navigation/carouselCollection.js";
import { NavigationBillboard } from "@navigation/billboard.js";

import "./connection.js"

Object.assign(window, {
  getFiberFromElement,
  toUndefinedIfNaN,

  __Billboard: Billboard,
  __Carousel: Carousel,
  __CarouselItem: CarouselItem,

  __NavigationBillboard: NavigationBillboard,
  __NavigationCarousel: NavigationCarousel,
  __NavigationCarouselCollection: NavigationCarouselCollection
})

// Object.assign(window, {
//   bb: new NavigationBillboard(),
//   ca: new Carousel(3),
//   nc: new NavigationCarousel(1),
//   cc: new NavigationCarouselCollection(1)
// })

// [data-carousel-selected="true"] [data-card-selected="true"] {
  // border: 1.5px solid;
  // border-radius: 10px;
  // padding: 6px;
// }