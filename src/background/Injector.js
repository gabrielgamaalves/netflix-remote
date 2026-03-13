/**
 * @typedef {Object} InjectorOptions
 * ->
 * @property {string} [id]
 * @property {string} [class]
 * @property {string} [rel]
 * @property {string} [type]
 * @property {string} [crossorigin]
 */

export class InjectorByURL {
  /**
   * @param {"link" | "script"} tagName
   * @param {string | URL} fileURL
   * @param {InjectorOptions} [options]
   */
  constructor(tagName, fileURL, options = {}) {
    this.tagName = tagName
    this.fileURL = fileURL
    this.options = options

    /** @type {HTMLScriptElement | HTMLLinkElement} */
    this.element = this.#createElement()
  }

  /**
   * @returns {HTMLScriptElement | HTMLLinkElement}
   */
  #createElement() {
    /** @type {HTMLScriptElement | HTMLLinkElement} */
    const element = document.createElement(this.tagName)
    element.dataset.injectId = String(Date.now()).match(/.{1,4}/g).join("-")

    if (this.tagName === "script") element.src = String(this.fileURL)
    else element.href = String(this.fileURL)

    Object.assign(element, this?.options)
    return element
  }

  /**
   * @param {Node} node
   * @returns {HTMLScriptElement | HTMLLinkElement}
   */
  inject(node) {
    node.appendChild(this.element)
    return this.element
  }
}