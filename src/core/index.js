import { NavigatorCarousel } from "@/core/navigation/NavigatorCarousel.js"

// @dev-test
const navigatorCarousel = new NavigatorCarousel()

async function advanceNextCard() {
	const cards = await navigatorCarousel.getCarousel().actions.advanceNextCard();
	// cards["0"].querySelector("a").dispatchEvent(new MouseEvent('mousemove', {
	// 	view: window,
	// 	bubbles: true,
	// 	cancelable: true,
	// 	clientX: 100,
	// 	clientY: 100
	// }))
}

async function advancePreviousCard() {
	const cards = await navigatorCarousel.getCarousel().actions.advancePreviousCard();
	// console.log(cards)
	// cards["0"].querySelector("a").dispatchEvent(new MouseEvent('mousemove', {
	// 	view: window,
	// 	bubbles: true,
	// 	cancelable: true,
	// 	clientX: 100,
	// 	clientY: 100
	// }))
}

document.addEventListener('keypress', (event) => {
	switch (event.key) {
		case 's': navigatorCarousel.up(); break;
		case 'w': navigatorCarousel.down(); break;
		case 'd': advanceNextCard(); break;
		case 'a': advancePreviousCard(); break;
		case 'f': document.activeElement.blur(); break;
	}
});

// *