var h = Object.defineProperty;
var m = (s, e, t) => e in s ? h(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var r = (s, e, t) => (m(s, typeof e != "symbol" ? e + "" : e, t), t);
class u {
  constructor() {
    r(this, "elems");
    r(this, "maxScrollDelta", 1e3);
    this.init();
  }
  init() {
    this.elems = document.querySelectorAll("[data-dsap]"), this.elems.forEach((e) => {
      e.dataset.dsap = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }), this.style = document.createElement("style"), this.style.id = "dsap-style", this.style.innerHTML = `:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`, document.head.appendChild(this.style), window.addEventListener("scroll", this.debounce(this.onScroll.bind(this)), { passive: !0 });
  }
  onScroll() {
    const e = window.scrollY, t = e + window.innerHeight;
    let a = [`:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`];
    this.elems.forEach((i) => {
      const o = i.getBoundingClientRect().top + e, c = o + i.getBoundingClientRect().height;
      let l = !1, n = !1, d = 0;
      t < o ? n = !1 : e > c ? n = !0 : l = !0, l ? d = ((t - o) / (i.getBoundingClientRect().height + window.innerHeight) * this.maxScrollDelta).toFixed(0) : n && (d = this.maxScrollDelta), i.dataset.dsapIs = l ? "in" : n ? "above" : "below", l && (i.dataset.dsapSeen = !0), a.push(`[data-dsap="${i.dataset.dsap}"]{--dsap-scroll-delta: ${d}}`);
    }), this.style.innerHTML !== a.join("") && (this.style.innerHTML = a.join(""));
  }
  debounce(e) {
    let t;
    return (...a) => {
      t && cancelAnimationFrame(t), t = requestAnimationFrame(() => {
        e(...a);
      });
    };
  }
}
export {
  u as DSAP
};
