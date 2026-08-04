import { Billboard, type BillboardButton } from "@components/Billboard.js";

export type BillboardSelectionHooks = {
  onButtonSelected?: (billboardButton: BillboardButton) => void
  onButtonDeselected?: (billboardButton: BillboardButton) => void
}

export const defaultBillboardHooks: Required<BillboardSelectionHooks> = {
  onButtonSelected: (billboardButton) => {
    billboardButton.element?.setAttribute("data-button-target", "true")
  },
  onButtonDeselected: (billboardButton) => {
    billboardButton.element?.removeAttribute("data-button-target")
  }
}

export class NavigationBillboard {
  billboard: Billboard
  hooks: Required<BillboardSelectionHooks>

  selectedButton?: BillboardButton
  selectedButtonIndex?: number

  _isMounted: boolean = false

  constructor(options?: BillboardSelectionHooks) {
    this.billboard = new Billboard()

    this.hooks = {
      onButtonSelected: options?.onButtonSelected ?? defaultBillboardHooks.onButtonSelected,
      onButtonDeselected: options?.onButtonDeselected ?? defaultBillboardHooks.onButtonDeselected
    }

    this.mount()
  }

  mount() {
    if (!this.billboard._isMounted) { this._isMounted = false; return false } else { this._isMounted = true }

    this.selectedButtonIndex = 0
    this.selectButton(0)

    return true
  }

  getButtonByIndex(buttonIndex: number): BillboardButton | undefined {
    if (!this._isMounted) return undefined

    const buttonsLength = this.billboard.buttons?.length ?? 0
    if (buttonIndex >= buttonsLength || buttonIndex < 0) return undefined

    const button = this.billboard.buttons?.[buttonIndex]
    return button
  }

  nextButton() {
    if (!this._isMounted) return undefined
    return this.selectButton(this.selectedButtonIndex! + 1)
  }
  previousButton() {
    if (!this._isMounted) return undefined
    return this.selectButton(this.selectedButtonIndex! - 1)
  }

  selectButton(buttonIndex: number) {
    if (!this._isMounted) return undefined

    const targetButton = this.getButtonByIndex(buttonIndex)
    if (!targetButton) return undefined

    this.deselectButton(this.selectedButtonIndex!)

    this.selectedButtonIndex = buttonIndex
    this.selectedButton = targetButton

    this.hooks.onButtonSelected(targetButton)

    return targetButton
  }

  deselectButton(buttonIndex: number) {
    if (!this._isMounted) return undefined

    const button = this.getButtonByIndex(buttonIndex)
    if (button) this.hooks.onButtonDeselected(button)
  }

  clickSelectedButton(): boolean {
    if (!this._isMounted || !this.selectedButton) return false

    this.selectedButton.element.click()
    return true
  }

  openPlayer() {
    if (!this._isMounted) return undefined
    this.billboard.openPlayer()
  }
  openPreviewModal() {
    if (!this._isMounted) return undefined
    this.billboard.openPreviewModal()
  }
}