class DSAP {

    // Setup elems variable
    elems;
    // Set the range of the viewport delta to 1000. The higher the number, the better "resolution" of the scroll delta
    maxScrollDelta = 1000;

    results = [];

    style
    testing = false;

    constructor() {
        this.init();
        let test;
        console.clear();
        setTimeout(() => {
            window.scrollTo(0, 0);
            console.log('Initial pass...');
            setTimeout(() => {
                test = setInterval(() => {
                    window.scrollBy(0, 10);
                }, 1);
            }, 100)
            setTimeout(() => {
                clearInterval(test);
                window.scrollTo(0, 0);
                console.clear();
                console.log('Initial pass... done');
            }, 3000);

            setTimeout(() => {
                this.testing = true;
                test = setInterval(() => {
                    // scroll +1px 
                    window.scrollBy(0, 1);
                }, 1);
            }, 4000);

            setTimeout(() => {
                clearInterval(test);
                window.scrollTo(0, 0);
                console.log('Test complete');
            }, 20000);

        }, 100);
    }

    init() {
        // Fetch all elements marked with the data-dsap attribute
        this.elems = document.querySelectorAll('[data-dsap]');

        // Create stylesheet to hold the CSS variables
        this.style = document.createElement('style');
        this.style.id = 'dsap-style';
        this.style.innerHTML = `:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`;
        document.head.appendChild(this.style);

        // Set data attribute to random hash (6 chars)
        this.elems.forEach(elem => {
            elem.dataset.dsap = Math.random().toString(36).substring(2, 12);
        });

        window.addEventListener(
            'scroll',
            // Pass scroll event through a debounce function which runs it through requestAnimationFrame to improve performance
            this.debounce(this.onScroll.bind(this)),
            // Ensure passive event listeners are used where possible to improve scrolling performance
            { passive: true }
        );


    }

    onScroll() {
        if (this.testing) {
            console.clear();
        }
        let start = performance.now();
        // Obtain the scroll position of the window
        const scrollY = window.scrollY;
        // Get the current viewport bottom position
        const viewportBottom = scrollY + window.innerHeight;

        let styles = [`:root{--dsap-max-scroll-delta: ${this.maxScrollDelta}}`];

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

            // Prepare the CSS to be injected
            styles.push(`[data-dsap="${elem.dataset.dsap}"]{--dsap-scroll-delta: ${viewportDelta}}`);
        });
        this.style.innerHTML = styles.join('');
        let end = performance.now();
        this.results.push(end - start);
        if (this.testing) {
            console.log(`DSAP took ${(end - start)} milliseconds for this scroll event`);

            console.log(`DSAP average (of ${this.results.length} events): ${this.results.reduce((a, b) => a + b, 0) / this.results.length} milliseconds.`);
            if (this.results.length > 2) {
                let last3 = this.results.slice(this.results.length - 50);
                console.log(`DSAP average (of last 50 events): ${last3.reduce((a, b) => a + b, 0) / last3.length} milliseconds.`);
                // for each 50, output the result
                let i = 0;
                let last50 = [];
                let last50Average = 0;
                this.results.forEach((result) => {
                    i++;
                    last50.push(result);
                    if (i === 50) {
                        last50Average = last50.reduce((a, b) => a + b, 0) / last50.length;
                        console.log(`DSAP average (of last 50 events): ${last50Average} milliseconds.`);
                        last50 = [];
                        i = 0;
                    }
                });
            }
        }
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