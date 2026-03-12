class NavigatorCarousel {
	constructor() {
		this.cache = new Map
		this.sizeCache = 3

		this.index = 1
		this.setCarousel()
	}

	setCarousel(someindex = 0) {
		if (this.index === 0 && Number(someindex) < 0) return

		if (this?.carousel) {
			this.carousel?.setAttribute("data-carousel-select", false);
		}

		this.index += Number(someindex)
		this.carousel = document.getElementById(`row-${this.index}`)
		window.carousel = this.carousel // DEV CONSOLE PAGE

		this.carousel.setAttribute("data-carousel-select", true)
		window.scrollTo({
			top: this.carousel.getBoundingClientRect().top + (window.scrollY - (window.innerHeight * 0.35)),
			behavior: "smooth"
		})

		if (this.cache.has(this.index))
			return this.cache.get(this.index)

		return this.setCache(new ActionsCarousel(this.carousel))
	}

	getCarousel() { return this.cache.get(this.index) }
	up() { return this.setCarousel("+1") }
	down() { return (this.index >= 0) && this.setCarousel("-1") }

	setCache(actionsCarousel) {
		const cacheKeys = [...this.cache.keys()]
		if (cacheKeys.length === this.sizeCache) {
			this.cache.delete(cacheKeys[0])
		}

		this.cache.set(this.index, {
			target: this.carousel,
			actions: actionsCarousel
		})

		return this.cache.get(this.index)
	}
}