var h = Object.defineProperty;
var m = (l, t, e) => t in l ? h(l, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[t] = e;
var r = (l, t, e) => (m(l, typeof t != "symbol" ? t + "" : t, e), e);
class u {
  constructor() {
    r(this, "elems");
    r(this, "maxScrollDelta", 1e3);
    this.init();
  }
  init() {
    this.elems = document.querySelectorAll("[data-dsap]"), this.elems.forEach((t) => {
      t.dataset.dsap = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }), this.style = document.createElement("style"), this.style.id = "dsap-style", this.style.innerHTML = `:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`, document.head.appendChild(this.style), this.doScroll(), window.addEventListener("scroll", this.debounce(this.doScroll.bind(this)), { passive: !0 });
  }
  doScroll() {
    const t = window.scrollY, e = t + window.innerHeight;
    let s = [`:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`];
    this.elems.forEach((i) => {
      const o = i.getBoundingClientRect().top + t, c = o + i.getBoundingClientRect().height;
      let a = !1, n = !1, d = 0;
      e < o ? n = !1 : t > c ? n = !0 : a = !0, a ? d = ((e - o) / (i.getBoundingClientRect().height + window.innerHeight) * this.maxScrollDelta).toFixed(0) : n && (d = this.maxScrollDelta), i.dataset.dsapIs = a ? "in" : n ? "above" : "below", a && (i.dataset.dsapSeen = !0), s.push(`[data-dsap="${i.dataset.dsap}"]{--dsap-scroll-delta: ${d}}`);
    }), this.style.innerHTML !== s.join("") && (this.style.innerHTML = s.join(""));
  }
  debounce(t) {
    let e;
    return (...s) => {
      e && cancelAnimationFrame(e), e = requestAnimationFrame(() => {
        t(...s);
      });
    };
  }
}
export {
  u as DSAP
};
