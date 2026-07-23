import { Carousel } from "@components/Carousel.js"
import { getFiberFromElement } from "@lib/react-fiber.js"

const slider = new Carousel(3);

window.slider = slider
window.getFiberFromElement = getFiberFromElement

