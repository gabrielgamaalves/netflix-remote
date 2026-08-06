export type SelectionHooks<T> = Record<string, (item: T) => void>

export type OptionsNavigationComponent<M> = {
  hooks?: SelectionHooks<M>
  [key: string]: any
}

export interface MountableComponent {
  element?: HTMLElement

  _isMounted: boolean
  hasLinkedElement: boolean
}

// M -> item item que é manipulado, H -> Hooks
export abstract class NavigationSelector<M, H = SelectionHooks<M>> {
  element?: HTMLElement
  hooks: Required<H>
  _isMounted: boolean = false

  private component?: MountableComponent

  protected constructor(
    defaultHooks: Required<H> ,
    options?: OptionsNavigationComponent<M>
  ) {

    this.hooks = Object.assign({}, defaultHooks, options?.hooks)
  }

  protected mountComponent(component: MountableComponent): boolean {
    this.component = component

    if (!component._isMounted) {
      this._isMounted = false
      return false
    }

    this._isMounted = true
    this.element = component.element!

    return true
  }

  get hasLinkedElement(): boolean {
    return this.component?.hasLinkedElement ?? false
  }
}