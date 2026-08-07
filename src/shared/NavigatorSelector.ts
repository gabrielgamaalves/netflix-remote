// import { NavigationBillboard } from "@navigation/billboard.js";
// import { NavigationCarouselCollection } from "@navigation/carouselCollection.js";

import { RemoteControlEmitter, type RemoteControlEventMap } from "@events/remoteControl.js";
import type EventEmitter from "@lib/events.js";
import type { DataConnection } from "peerjs";

export type NavigationSelectionHook<N> = Record<string, (value: N) => void>

export type NavigationHandlers<N, T = NavigatorSelector<any>> = Record<string, (navigation: N, navigator: T, ...data: any[]) => void>

export type NavigationEntry<N = any, T = NavigatorSelector<any>> = {
  navigation: N
  handlers?: NavigationHandlers<N, T>,
  hooks?: NavigationSelectionHook<N> | undefined
}

export type NavigatorEmitters = ({ emitter: EventEmitter, eventMap: readonly string[] })[]

export class NavigatorSelector<T extends Record<string, NavigationEntry>> {
  protected navigations: T
  protected readonly gridNavigations: (keyof T)[]

  protected navigationIndex: number = 0
  protected navigation!: T[keyof T]

  protected emitter: NavigatorEmitters

  protected constructor(
    navigations: T,
    grid: (keyof T)[],
    emitter: NavigatorEmitters
  ) {
    this.emitter = emitter

    this.navigations = navigations
    this.gridNavigations = grid

    this.setNavigation(this.navigationIndex)
    this.registerEventHandlers()
  }

  protected registerEventHandlers() {
    this.emitter.forEach(({ emitter, eventMap }) => {
      eventMap.forEach(event => {
        emitter.on(event, () => this.navigation?.handlers?.[event]?.(this.navigation.navigation, this))
      })
    })
  }

  private getNavigationFromGrid(index: number) {
    if (index >= this.gridNavigations.length || index < 0) return undefined

    const navigationKey = this.gridNavigations[index]!
    return this.navigations[navigationKey]
  }

  nextNavigation() {
    return this.setNavigation(this.navigationIndex + 1)
  }
  previousNavigation() {
    return this.setNavigation(this.navigationIndex - 1)
  }

  setNavigation(index: number) {
    this.navigation?.navigation?.element?.removeAttribute("data-navigation-selected")
    this.navigation?.hooks?.onDeselected?.(this.navigation.navigation as never)
    
    const navigation = this.getNavigationFromGrid(index)
    if (!navigation) return this.getNavigationFromGrid(this.navigationIndex)!


    this.navigationIndex = index
    this.navigation = navigation

    navigation?.navigation?.element?.setAttribute("data-navigation-selected", "true")
    navigation?.hooks?.onSelected?.(this.navigation.navigation as never)

    return navigation
  }
}