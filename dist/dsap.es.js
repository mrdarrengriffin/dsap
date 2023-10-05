var d = Object.defineProperty;
var h = (i, e, t) => e in i ? d(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var r = (i, e, t) => (h(i, typeof e != "symbol" ? e + "" : e, t), t);
class u {
  constructor() {
    r(this, "elems");
    r(this, "maxScrollDelta", 1e3);
    this.init();
  }
  init() {
    this.elems = document.querySelectorAll("[data-dsap]"), document.documentElement.style.setProperty("--dsap-max-scroll-delta", this.maxScrollDelta), window.addEventListener("scroll", this.debounce(this.onScroll.bind(this)), { passive: !0 });
  }
  onScroll() {
    const e = window.scrollY, t = e + window.innerHeight;
    this.elems.forEach((n) => {
      const l = n.getBoundingClientRect().top + e, c = l + n.getBoundingClientRect().height;
      let o = !1, s = !1, a = 0;
      t < l ? s = !1 : e > c ? s = !0 : o = !0, o ? a = ((t - l) / (n.getBoundingClientRect().height + window.innerHeight) * this.maxScrollDelta).toFixed(0) : s && (a = this.maxScrollDelta), n.dataset.dsapIs = o ? "in" : s ? "above" : "below", o && (n.dataset.dsapSeen = !0), n.style.setProperty("--dsap-scroll-delta", a);
    });
  }
  debounce(e) {
    let t;
    return (...n) => {
      t && cancelAnimationFrame(t), t = requestAnimationFrame(() => {
        e(...n);
      });
    };
  }
}
export {
  u as DSAP
};
