import { Billboard, type BillboardButton } from "@components/Billboard.js";
import { NavigationSelector } from "@shared/NavigationSelector.js";

export type OptionsNavigationBillboard = {
  hooks?: ButtonsSelectionHooks
}

export type ButtonsSelectionHooks = {
  onButtonSelected?: (billboardButton: BillboardButton) => void
  onButtonDeselected?: (billboardButton: BillboardButton) => void
}

const BUTTON_SELECTED_DATASET = "data-button-selected"

export const defaultHooks: Required<ButtonsSelectionHooks> = {
  onButtonSelected: (billboardButton) => { },
  onButtonDeselected: (billboardButton) => { }
}

export class NavigationBillboard extends NavigationSelector<BillboardButton, ButtonsSelectionHooks> {
  billboard: Billboard

  selectedButton?: BillboardButton
  selectedButtonIndex?: number

  _isMounted: boolean = false

  constructor(options?: OptionsNavigationBillboard) {
    super(defaultHooks, options)
    this.billboard = new Billboard()

    this.mount()
  }

  mount() {
    this.mountComponent(this.billboard)

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
    this.billboard.refreshIfNeeded()

    const targetButton = this.getButtonByIndex(buttonIndex)
    if (!targetButton) return undefined

    this.selectedButton?.element?.removeAttribute(BUTTON_SELECTED_DATASET)
    this.deselectButton(this.selectedButtonIndex!)
    
    this.selectedButtonIndex = buttonIndex
    this.selectedButton = targetButton

    targetButton?.element?.setAttribute(BUTTON_SELECTED_DATASET, "true")
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