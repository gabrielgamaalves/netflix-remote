import type { NavigationBillboard } from "@navigation/billboard.js"
import type { NavigationHandlers } from "@shared/NavigatorSelector.js"

export const billboardEventsHandlers: NavigationHandlers<NavigationBillboard> = {
  KEY_UP: () => { },
  KEY_DOWN: (navigation, navigator) => { 
    navigator.nextNavigation()
  },
  KEY_RIGHT: (navigation, navigator) => { 
    navigation.nextButton()
  },
  KEY_LEFT: (navigation, navigator) => { 
    navigation.previousButton()
  },
  KEY_ENTER: (navigation, navigator) => { 
    navigation.clickSelectedButton()
  },
}