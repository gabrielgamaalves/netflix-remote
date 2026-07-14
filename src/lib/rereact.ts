interface ReactProps {
  children: ReactElement | ReactElement[] | undefined;
  [key: string]: any
}

interface IReactElement {
  $$typeof?: symbol;
  type: any;
  key?: string | null;
  ref: any;
  props: ReactProps;
  _owner: HTMLReact;
  _store?: any;
  [key: string]: any;
}

export class ReactElement {
  public $$typeof?: symbol;
  public type: any;
  public key?: string | null;
  public ref: any;
  public props!: ReactProps;
  public _owner!: HTMLReact;
  public _store?: any;
  [key: string]: any;

  constructor(reactElement: IReactElement) {
    Object.assign(this, reactElement)

    if (this.props?.children) {
      this.props.children = ReactElement.childrenReactElements(this.props.children) || this.props.children
    }
  }

  get isReactComponent(): boolean {
    return false
  }

  get isReactElement(): boolean {
    return !!this.$$typeof && (this.$$typeof.description === "react.element")
  }

  static childrenReactElements(children?: any) {
    if (!children) return

    const isReactElement = (element: any) => !!element?.$$typeof && (element.$$typeof.description === "react.element")

    if ((typeof children === "object") && isReactElement(children)) {
      return new ReactElement(children)
    }

    if (Array.isArray(children)) {
      const mapped = children.map(function (child) {
        if (!isReactElement(child)) return
        return new ReactElement(child)
      }).filter(f => f)

      return mapped.length > 0 ? mapped : undefined
    }

    return children
  }
}

export class HTMLReact {
  private element?: Element | null
  private fiberCache?: any

  public tag?: number;
  public key?: string | null;
  public type?: any;
  public stateNode?: any;
  public return?: HTMLReact | null;
  public child?: HTMLReact | null;
  public sibling?: HTMLReact | null;

  public memoizedProps?: ReactProps;
  public memoizedState?: any;
  public updateQueue?: any;

  [key: string]: any;

  constructor(element?: Element) {
    if (!element) {
      this.element = null
      return
    }
    
    this.element = element;
    const fiber = this.reactFiber()
    
    if (fiber) {
      Object.assign(this, fiber)
      this.fiberCache = fiber
    }

    if (this.memoizedProps?.children) {
      const processed = ReactElement.childrenReactElements(this.memoizedProps.children)
      if (processed) {
        this.memoizedProps.children = processed
      }
    }
  }

  private reactFiber() {
    if (!this.element) return null

    const keyFiber: string | undefined = Object.keys(this.element)
      .find(key =>
        key.startsWith('__reactFiber$')
      );

    if (!keyFiber) return null;

    return (this.element as any)[keyFiber];
  }

  get isReactComponent(): boolean {
    return !!this.tag && (this.tag >= 2 && this.tag <= 6)
  }

  get props(): ReactProps | null {
    return this.memoizedProps || null;
  }

  get state(): any {
    return this.memoizedState || null;
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