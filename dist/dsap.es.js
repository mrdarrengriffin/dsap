class o {
  constructor() {
    window.addEventListener("scroll", this.scroll.bind(this));
  }
  scroll() {
    console.log("scrolling");
  }
}
export {
  o as DSAP
};
