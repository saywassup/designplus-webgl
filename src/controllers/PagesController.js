import { randomInt } from "math-toolbox";
import { viewport } from "../emitters/viewport";
import { PageDebugger } from "../PageDebugger";

// Elements
import { PageElement } from "../elements/PageElement";
import { SquareElement } from "../elements/SquareElement";

// Components
import { BoxElement } from "../components/BoxElement";

// Store
import { ElementsStore } from "../store/ElementsStore";
import { PagesStore } from "../store/PagesStore";
import bidelloSingleton from "bidello";

export class PagesController {
    constructor() {
        // Init 一 Variables
        this.el = document.getElementById("page-container");

        // Bind 一 Methods
        this.initPages = this.initPages.bind(this);
        this.resetPages = this.resetPages.bind(this);
        this.addPage = this.addPage.bind(this);
        this.addElement = this.addElement.bind(this);

        PageDebugger.cbAddPageHandler = () => this.addPage();
        PageDebugger.cbCreatePagesHandler = () => this.initPages();

        // Init 一 Pages
        this.initPages();
        this.initBoxElement();

        console.log(this);

        console.log(bidelloSingleton)
    }

    initBoxElement() {
        BoxElement.renderIn(this.el);
    }

    initPages() {
        this.resetPages();

        for (let i = 0; i < PageDebugger.NUMBER_OF_PAGES; i++) {
            this.addPage();
        }

        PageDebugger.updateStats(ElementsStore.elements.size);
    }

    resetPages() {
        if (PagesStore.pages.size) {
            PagesStore.pages.forEach(page => page.__destroy());
        }
     }

    addPage() {
        // Init 一 Page element class
        let page = new PageElement({ parentRef: this });
        this.el.appendChild(page.el);
        
        page.computeBoundings();
        page.initIntersectionObserver();

        // Save page reference to __pages Map
        PagesStore.pages.set(page.id, page);
        PagesStore.pageBoundings = page.boundings;

        // Init 一 Elements on this current page creation
        for (let i = 0; i < PageDebugger.NUMBER_OF_ELEMENTS_PER_PAGE; i++) {
            this.addElement(page.id);
        }

        PageDebugger.updateStats(ElementsStore.elements.size);
    }

    addElement(pageId) {
        let page = PagesStore.pages.get(pageId);

        if (page) {
            let position = [
                randomInt(0, page.boundings.width - 80),
                randomInt(0, page.boundings.height - 80)
            ];

            // Init 一 Square Element class
            let element = new SquareElement({ parentRef: this, pageId, position });
            page.elCanvas.appendChild(element.el);

            // Save element reference to __elements Map
            ElementsStore.elements.set(element.id, element);
        }

        PageDebugger.updateStats(ElementsStore.elements.size);
    }

    recalculatePages() {
        PagesStore.pages.forEach(page => page.computeBoundings());
        viewport.onResize();
        viewport.onScroll();
    }
}
