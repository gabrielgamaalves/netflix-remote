interface IReactElement {
  $$typeof?: symbol;
  type: any;
  key?: string | null;
  ref: any;
  props: any;
  _owner: any;
  _store?: any;

  [key: string]: any;
}

export class ReactElement {
  public $$typeof?: symbol;
  public type: any;
  public key?: string | null;
  public ref: any;
  public props: any;
  public _owner: any;
  public _store?: any;

  [key: string]: any;

  constructor(reactElement: IReactElement) {
    (
      Object.assign(this, reactElement),
      this.props.children = ReactElement.childrenReactElements(this.props.children)
    )
  }

  get isReactComponent(): boolean {
    return !!this.tag && (this.tag >= 2 && this.tag <= 6)
  }

  get isReactElement(): boolean {
    return !!this.$$typeof && (this.$$typeof.description === "react.element")
  }

  static childrenReactElements(children?: any) {
    if (!children) return

    const isReactElement = (element: any) => !!element.$$typeof && (element.$$typeof.description === "react.element")

    if ( (typeof children === "object") && isReactElement(children)) { 
      return new ReactElement(children) 
    }

    if (Array.isArray(children)) {
      return (
        children.map(function (child) {
          if (!isReactElement(child)) return
          return new ReactElement(child)
        }).filter(f => f) as ReactElement[]
      )
    }
  }
}

export class HTMLReact {
  private element?: Element | null

  public tag?: number;
  public key?: string | null;
  public type?: any;
  public stateNode?: any;
  public return?: HTMLReact | null;
  public child?: HTMLReact | null;
  public sibling?: HTMLReact | null;

  public memoizedProps?: any;
  public memoizedState?: any;
  public updateQueue?: any;

  [key: string]: any;

  constructor(element?: Element) {
    if (!element) return
    this.element = element;

    (
      Object.assign(this, this.reactFiber()),
      this.props.children = ReactElement.childrenReactElements(this.props.children)
    )
  }

  private reactFiber() {
    if (!this.element) return

    const keyFiber: string | undefined = Object.keys(this.element)
      .find(key =>
        key.startsWith('__reactFiber$')
      );

    if (!keyFiber) return;

    const fiber = (this.element as any)[keyFiber];
    return fiber
  }

  get isReactComponent(): boolean {
    return !!this.tag && (this.tag >= 2 && this.tag <= 6)
  }

  get props(): any {
    return this?.memoizedProps || null;
  }

  get state(): any {
    return this?.memoizedState || null;
  }

  get componentType(): string | null {
    if (!this.type) return null;
    return typeof this.type === 'function'
      ? this.type.name || 'Anonymous'
      : String(this.type);
  }

  public forceUpdate(): void {
    const instance = this?.stateNode;
    if (instance && typeof instance.forceUpdate === 'function') {
      instance.forceUpdate();
    }
  }
}