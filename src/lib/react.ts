export class ReactElement {
  element: Element

  constructor(element: Element) {
    this.element = element;
  }

  getProps(): Record<string, string> | undefined{
    const keyFiber: string | undefined = Object.keys(this.element)
      .find(key =>
        key.startsWith('__reactFiber$')
      );

    if (!keyFiber) return;

    let fiber = (this.element as any)[keyFiber];
    let props = null;

    if (!fiber) return

    while (fiber) {
      if (fiber.memoizedProps) {
        props = fiber.memoizedProps;
        break;
      }

      fiber = fiber.return;
    }

    return props;
  }
}

// export class ReactRoot {
//   root?: Element
//   props: Record<string, string> | undefined

//   constructor (selector: string = "#root") {
//     const root = document.querySelector(selector)

//     if (!root) return 

//     this.root = root as Element
//     this.props = new ReactElement(this.root).getProps()
//   }
// }