class DSAP {

    // Setup elems variable
    elems;
    // Set the range of the viewport delta to 1000. The higher the number, the better "resolution" of the scroll delta
    maxScrollDelta = 1000;

    constructor() {
        this.init();
    }

    init() {
        // Fetch all elements marked with the data-dsap attribute
        this.elems = document.querySelectorAll('[data-dsap]');

        // Set the maxScrollDelta as a :root CSS variable to help with CSS calculations
        document.documentElement.style.setProperty('--dsap-max-scroll-delta', this.maxScrollDelta);

        window.addEventListener(
            'scroll',
            // Pass scroll event through a debounce function which runs it through requestAnimationFrame to improve performance
            this.debounce(this.onScroll.bind(this)),
            // Ensure passive event listeners are used where possible to improve scrolling performance
            { passive: true }
        );
    }

    onScroll() {
        // Obtain the scroll position of the window
        const scrollY = window.scrollY;
        // Get the current viewport bottom position
        const viewportBottom = scrollY + window.innerHeight;

        // For each element marked with the data-dsap attribute...
        this.elems.forEach(elem => {
            // Get the element's top and bottom position
            const elementTop = elem.getBoundingClientRect().top + scrollY;
            const elementBottom = elementTop + elem.getBoundingClientRect().height;

            // Setup some variables to track the element's position relative to the viewport
            let inViewport = false;
            let aboveViewport = false;
            let viewportDelta = 0;

            // Determine the element's position relative to the viewport
            if (viewportBottom < elementTop) {
                aboveViewport = false;
            } else if (scrollY > elementBottom) {
                aboveViewport = true;
            } else {
                inViewport = true;
            }

            // If the element is in the viewport, calculate the delta of the element that is visible
            if (inViewport) {
                const delta = (viewportBottom - elementTop) / (elem.getBoundingClientRect().height + window.innerHeight);
                viewportDelta = (delta * this.maxScrollDelta).toFixed(0);
            } else if (aboveViewport) {
                // If the element is above the viewport, set the delta to 100 to ensure no odd values are applied
                viewportDelta = this.maxScrollDelta;
            }

            // Set a data attribute, desribing if the element is in, above or below the viewport
            elem.dataset.dsapIs = inViewport ? 'in' : (aboveViewport ? 'above' : 'below');

            // Set a data attribute to track if the element has been seen. Once the element has been seen, it will not be reset
            if (inViewport) {
                elem.dataset.dsapSeen = true;
            }

            // Set a data attribute to track the delta of the element that is visible
            elem.style.setProperty('--dsap-scroll-delta', viewportDelta);
        });
    }

    /**
     * A debounce function that uses requestAnimationFrame
     * @param {function} fn - Function to debounce 
     * 
     * Credit: https://pqina.nl/blog/applying-styles-based-on-the-user-scroll-position-with-smart-css/
     */
    debounce(fn) {
        // This holds the requestAnimationFrame reference, so we can cancel it if we wish
        let frame;

        // The debounce function returns a new function that can receive a variable number of arguments
        return (...params) => {
            // If the frame variable has been defined, clear it now, and queue for next frame
            if (frame) {
                cancelAnimationFrame(frame);
            }

            // Queue our function call for the next frame
            frame = requestAnimationFrame(() => {
                // Call our function and pass any params we received
                fn(...params);
            });
        };

    }

}

export { DSAP };