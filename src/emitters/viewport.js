import bidello from 'bidello';
import debounce from 'lodash.debounce';

class Viewport {
    constructor() {
        this.width = this.calculateWidth();
        this.height = this.calculateHeight();
        this.ratio = this.width / this.height;
        this.fontSize = 1;

        this.scroll = { x: 0, y: 0 };

        this.onResize = debounce(this.onResize.bind(this), 100);
        this.onResize();

        this.onScroll = debounce(this.onScroll.bind(this), 50);
        this.onScroll();

        window.addEventListener("scroll", this.onScroll);
        window.addEventListener("resize", this.onResize);
    }

    calculateWidth() {
        return window.innerWidth;
    }

    calculateHeight() {
        return window.innerHeight;
    }

    calculateFontSize() {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    onScroll() {
        this.scroll.x = window.scrollX;
        this.scroll.y = window.scrollY;
    }

    onResize() {
        this.width = this.calculateWidth();
        this.height = this.calculateHeight();
        this.ratio = this.width / this.height;
        this.fontSize = this.calculateFontSize();
        
        this.onScroll();

        bidello.trigger({ name: 'resize', fireAtStart: true }, {
            width: this.width,
            height: this.height,
            ratio: this.ratio,
        });
    }
};

export const viewport = new Viewport();
