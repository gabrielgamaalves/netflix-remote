import { NavigationBillboard } from "@navigation/billboard.js";
import { billboardEventsHandlers } from "@navigation/handlers/billboard.js";

import { NavigationCarouselCollection } from "@navigation/carouselCollection.js";
import { carouselCollectionEventsHandlers } from "@navigation/handlers/carouselCollection.js";

import { NavigatorSelector, type NavigationEntry } from "@shared/NavigatorSelector.js";

import type { DataConnection } from "peerjs";
import { RemoteControlEmitter, remoteControlEvents } from "@events/remoteControl.js";

export type NavigatorBrowseNavigations = {
  billboard: NavigationEntry<NavigationBillboard>,
  carouselCollection: NavigationEntry<NavigationCarouselCollection>
}

export class NavigatorBrowse extends NavigatorSelector<NavigatorBrowseNavigations> {
  constructor(connection: DataConnection) {
    super(
      {
        "billboard": {
          navigation: new NavigationBillboard(),
          handlers: billboardEventsHandlers,
          hooks: {
            onSelected: (navigation) => {
              const element = navigation.billboard._domRefs?.billboardActions!
              window.scrollTo({
                top: (element.offsetTop - (element.offsetTop - element.getBoundingClientRect().height)),
                behavior: "smooth"
              })
            }
          }
        },
        "carouselCollection": {
          navigation: new NavigationCarouselCollection(1, {
            hooks: {
              onCarouselSelected: (carousel, carouselCollection) => {
                if (carouselCollection?.latestAction === "initialized") return undefined;
                carousel?.element?.setAttribute("data-navigation-selected", "true")
              },
              onCarouselDeselected: (carousel) => {
                carousel?.element?.removeAttribute("data-navigation-selected")
              },
            }
          }),
          handlers: carouselCollectionEventsHandlers,
          hooks: {
            onSelected: (navigation) => {
              const element = navigation.selectedCarousel?.carousel.element!

              window.scrollTo({
                top: (element.offsetTop - element.getBoundingClientRect().height),
                behavior: "smooth"
              })
            }
          }
        }
      },
      [
        "billboard",
        "carouselCollection"
      ],
      [{
        emitter: new RemoteControlEmitter(connection),
        eventMap: remoteControlEvents
      }]

    )
  }
}