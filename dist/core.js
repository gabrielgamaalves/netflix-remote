var NetflixRemote = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/core/actions/ActionsCarousel.js
  var SampleCardsManager, ActionsCarousel;
  var init_ActionsCarousel = __esm({
    "src/core/actions/ActionsCarousel.js"() {
      SampleCardsManager = class {
        constructor(carousel) {
          this.carousel = carousel;
          const queryCards = this.get();
          this.cards = queryCards.length < 5 ? this.set(this.findIntialSampleCard("0", false)) : this.toJSON(queryCards);
        }
        get() {
          return [...this.carousel?.querySelectorAll(`.slider-item[data-c]`)];
        }
        toJSON(arrayCards) {
          const cards = {};
          arrayCards.forEach((card) => {
            cards[`${card.getAttribute("data-c")}`] = card;
          });
          return cards;
        }
        findIntialSampleCard(sliderItemIndex = "0", ignoreDatac = true) {
          const sliderItem = this.carousel.querySelector(`.slider-item.slider-item-${sliderItemIndex}`);
          return ignoreDatac ? sliderItem : this.get().find((e) => e?.getAttribute("data-c") === "0") || sliderItem;
        }
        set(cardElem, datacDescarted) {
          if (datacDescarted && this.cards?.[datacDescarted]) {
            this.cards[datacDescarted].removeAttribute("data-c");
          }
          cardElem.setAttribute("data-c", "0");
          cardElem?.previousElementSibling?.previousElementSibling?.setAttribute("data-c", "-2");
          cardElem?.previousElementSibling?.setAttribute("data-c", "-1");
          cardElem?.nextElementSibling?.setAttribute("data-c", "1");
          cardElem?.nextElementSibling?.nextElementSibling?.setAttribute("data-c", "2");
          const cards = this.get();
          this.cards = this.toJSON(cards);
          cards.forEach((card) => {
            const sliderRefocus = card.querySelector("a");
            if (!sliderRefocus || sliderRefocus.classList.contains("slider-refocus-disable")) return;
            sliderRefocus.className = "slider-refocus-disable";
          });
          return this.cards;
        }
        removeAllDatac() {
          Object.entries(this.cards).forEach(([pos, card]) => {
            card.removeAttribute("data-c");
          });
        }
      };
      ActionsCarousel = class {
        constructor(carousel) {
          this.carousel = carousel;
          this.sampleCardsManager = new SampleCardsManager(this.carousel);
        }
        async advanceNextCard() {
          const sampleCardsManager = this.sampleCardsManager;
          if (!sampleCardsManager.cards["2"]?.classList[1]?.split("-")?.[2])
            this.carousel.querySelector(".handle.handleNext.active").click();
          return await new Promise(function(resolve) {
            setTimeout(() => {
              const errNextCard = !sampleCardsManager?.cards["0"]?.classList[1]?.split("-")?.[2] || !sampleCardsManager?.cards["1"]?.parentNode;
              if (errNextCard)
                sampleCardsManager.removeAllDatac();
              resolve(sampleCardsManager.set(
                errNextCard ? sampleCardsManager.findIntialSampleCard("1") : sampleCardsManager.cards["1"],
                "-2"
              ));
            }, 100);
          });
        }
        async advancePreviousCard() {
          const sampleCardsManager = this.sampleCardsManager;
          const cardsLength = Object.keys(sampleCardsManager.cards).length;
          if (cardsLength < 4) return;
          if (cardsLength === 5 && !sampleCardsManager.cards["-2"]?.classList[1]?.split("-")?.[2])
            this.carousel.querySelector(".handle.handlePrev.active").click();
          return await new Promise(function(resolve) {
            setTimeout(() => {
              const errNextCard = !sampleCardsManager?.cards["0"]?.classList[1]?.split("-")?.[2] || !sampleCardsManager?.cards["-1"]?.parentNode;
              if (errNextCard)
                sampleCardsManager.removeAllDatac();
              resolve(sampleCardsManager.set(
                errNextCard ? sampleCardsManager.findIntialSampleCard("5") : sampleCardsManager.cards["-1"],
                "2"
              ));
            }, 100);
          });
        }
      };
    }
  });

  // src/core/navigator/NavigatorCarousel.js
  var NavigatorCarousel;
  var init_NavigatorCarousel = __esm({
    "src/core/navigator/NavigatorCarousel.js"() {
      init_ActionsCarousel();
      NavigatorCarousel = class {
        constructor() {
          this.cache = /* @__PURE__ */ new Map();
          this.sizeCache = 3;
          this.index = 1;
          this.setCarousel();
        }
        setCarousel(someindex = 0) {
          if (this.index === 0 && Number(someindex) < 0) return;
          if (this?.carousel) {
            this.carousel?.setAttribute("data-carousel-select", false);
          }
          this.index += Number(someindex);
          this.carousel = document.getElementById(`row-${this.index}`);
          window.carousel = this.carousel;
          this.carousel.setAttribute("data-carousel-select", true);
          window.scrollTo({
            top: this.carousel.getBoundingClientRect().top + (window.scrollY - window.innerHeight * 0.35),
            behavior: "smooth"
          });
          if (this.cache.has(this.index))
            return this.cache.get(this.index);
          return this.setCache(new ActionsCarousel(this.carousel));
        }
        getCarousel() {
          return this.cache.get(this.index);
        }
        up() {
          return this.setCarousel("+1");
        }
        down() {
          return this.index >= 0 && this.setCarousel("-1");
        }
        setCache(actionsCarousel) {
          const cacheKeys = [...this.cache.keys()];
          if (cacheKeys.length === this.sizeCache) {
            this.cache.delete(cacheKeys[0]);
          }
          this.cache.set(this.index, {
            target: this.carousel,
            actions: actionsCarousel
          });
          return this.cache.get(this.index);
        }
      };
    }
  });

  // src/core/index.js
  var require_index = __commonJS({
    "src/core/index.js"() {
      init_NavigatorCarousel();
      var navigatorCarousel = new NavigatorCarousel();
      async function advanceNextCard() {
        const cards = await navigatorCarousel.getCarousel().actions.advanceNextCard();
        cards["0"].querySelector("a").dispatchEvent(new MouseEvent("mousemove", {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: 100,
          clientY: 100
        }));
      }
      async function advancePreviousCard() {
        const cards = await navigatorCarousel.getCarousel().actions.advancePreviousCard();
      }
      document.addEventListener("keypress", (event) => {
        switch (event.key) {
          case "s":
            navigatorCarousel.up();
            break;
          case "w":
            navigatorCarousel.down();
            break;
          case "d":
            advanceNextCard();
            break;
          case "a":
            advancePreviousCard();
            break;
          case "f":
            document.activeElement.blur();
            break;
        }
      });
    }
  });
  return require_index();
})();
