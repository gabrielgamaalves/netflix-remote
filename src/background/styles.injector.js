import { InjectorByURL } from "./Injector.js"
import { CONFIG } from "@/config/app.config.js"

const INJECTED_STYLES = [
  "netflix-remote"
]

export default function () {
  INJECTED_STYLES.forEach(function (STYLE) {
    (new InjectorByURL("link", new URL(("/style/injected/" + STYLE), CONFIG.baseURL)))
      .inject(document.head)
  })
}