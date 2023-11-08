var h = Object.defineProperty;
var p = (s, t, e) => t in s ? h(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var n = (s, t, e) => (p(s, typeof t != "symbol" ? t + "" : t, e), e);
class u {
  constructor(t = {}) {
    n(this, "elems");
    n(this, "maxScrollDelta", 1e3);
    n(this, "defaultOptions", { trackPosition: !0 });
    this.options = { ...this.defaultOptions, ...t }, this.init();
  }
  init() {
    this.elems = document.querySelectorAll("[data-dsap]"), this.elems.forEach((t) => {
      t.dataset.dsap = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }), this.style = document.createElement("style"), this.style.id = "dsap-style", this.style.innerHTML = `:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`, document.head.appendChild(this.style), this.doScroll(), window.addEventListener("scroll", this.debounce(this.doScroll.bind(this)), { passive: !0 });
  }
  doScroll() {
    const t = window.scrollY, e = t + window.innerHeight;
    let o = [`:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`];
    this.elems.forEach((i) => {
      const d = i.getBoundingClientRect().top + t, c = d + i.getBoundingClientRect().height;
      let l = !1, a = !1, r = 0;
      e < d ? a = !1 : t > c ? a = !0 : l = !0, this.options.trackPosition && (l ? r = ((e - d) / (i.getBoundingClientRect().height + window.innerHeight) * this.maxScrollDelta).toFixed(0) : a && (r = this.maxScrollDelta)), i.dataset.dsapIs = l ? "in" : a ? "above" : "below", l && (i.dataset.dsapSeen = !0), this.options.trackPosition && o.push(`[data-dsap="${i.dataset.dsap}"]{--dsap-scroll-delta: ${r}}`);
    }), this.style.innerHTML !== o.join("") && (this.style.innerHTML = o.join(""));
  }
  debounce(t) {
    let e;
    return (...o) => {
      e && cancelAnimationFrame(e), e = requestAnimationFrame(() => {
        t(...o);
      });
    };
  }
}
export {
  u as DSAP
};
