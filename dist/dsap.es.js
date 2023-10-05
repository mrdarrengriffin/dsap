var d = Object.defineProperty;
var h = (l, e, t) => e in l ? d(l, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[e] = t;
var r = (l, e, t) => (h(l, typeof e != "symbol" ? e + "" : e, t), t);
class u {
  constructor() {
    // Setup elems variable
    r(this, "elems");
    // Set the range of the viewport delta to 1000. The higher the number, the better "resolution" of the scroll delta
    r(this, "maxScrollDelta", 1e3);
    this.init();
  }
  init() {
    this.elems = document.querySelectorAll("[data-dsap]"), document.documentElement.style.setProperty("--dsap-max-scroll-delta", this.maxScrollDelta), window.addEventListener(
      "scroll",
      // Pass scroll event through a debounce function which runs it through requestAnimationFrame to improve performance
      this.debounce(this.onScroll.bind(this)),
      // Ensure passive event listeners are used where possible to improve scrolling performance
      { passive: !0 }
    );
  }
  onScroll() {
    const e = window.scrollY, t = e + window.innerHeight;
    this.elems.forEach((o) => {
      const n = o.getBoundingClientRect().top + e, c = n + o.getBoundingClientRect().height;
      let i = !1, s = !1, a = 0;
      t < n ? s = !1 : e > c ? s = !0 : i = !0, i ? a = ((t - n) / (o.getBoundingClientRect().height + window.innerHeight) * this.maxScrollDelta).toFixed(0) : s && (a = this.maxScrollDelta), o.dataset.dsapIs = i ? "in" : s ? "above" : "below", i && (o.dataset.dsapSeen = !0), o.style.setProperty("--dsap-scroll-delta", a);
    });
  }
  /**
   * A debounce function that uses requestAnimationFrame
   * @param {function} fn - Function to debounce 
   * 
   * Credit: https://pqina.nl/blog/applying-styles-based-on-the-user-scroll-position-with-smart-css/
   */
  debounce(e) {
    let t;
    return (...o) => {
      t && cancelAnimationFrame(t), t = requestAnimationFrame(() => {
        e(...o);
      });
    };
  }
}
export {
  u as DSAP
};
