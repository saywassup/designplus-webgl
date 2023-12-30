const { v4: uuidv4 } = require("uuid");

import { component } from "bidello";

import debounce from "lodash.debounce";
import { viewport } from "../emitters/viewport";
import { PageDebugger } from "../PageDebugger";

// Store
import { PagesStore } from "../store/PagesStore";
import { ElementsStore } from "../store/ElementsStore";


export const PAGE_BOUNDINGS = {};

export const PAGE_CLASS_NAMES = {
    EL: "page",
    TAG: "page__tag",
    CONTAINER_TOOLS: 'page__tools',
    CONTAINER_ACTIONS: 'page__actions',
    CANVAS: "page__canvas",
    CANVAS_OVERLAY: "page__canvas-overlay",
    BUTTON_DELETE: "page__button-delete"
};

/**
 * TODO: INITIALIZE A PAGE STORE WHEN INSTANCIATE A PAGE ELEMENT
 */

export class PageElement extends component() {
    constructor({ parentRef = {} } = {}) {
        super();

        // Init 一 Variables
        this.parentRef = parentRef;

        this.id = uuidv4();
        this.isActive = false;
        this.boundings = {};

        // Init 一 DOMElements
        // 1.
        this.el = document.createElement("div");
        this.el.classList.add(PAGE_CLASS_NAMES.EL);
        this.el.id = this.id;

        // 2.
        this.elContainerTools = document.createElement("div");
        this.elContainerTools.classList.add(PAGE_CLASS_NAMES.CONTAINER_TOOLS);
        this.el.appendChild(this.elContainerTools);

        this.elTag = document.createElement("div");
        this.elTag.classList.add(PAGE_CLASS_NAMES.TAG);
        this.elTag.innerHTML = `Page`;
        this.elContainerTools.appendChild(this.elTag);

        // 3.
        this.elContainerActions = document.createElement("div");
        this.elContainerActions.classList.add(PAGE_CLASS_NAMES.CONTAINER_ACTIONS);
        this.elContainerTools.appendChild(this.elContainerActions);

        this.elButtonDelete = document.createElement("div");
        this.elButtonDelete.classList.add(PAGE_CLASS_NAMES.BUTTON_DELETE);
        this.elContainerActions.appendChild(this.elButtonDelete);

        // 4.
        this.elCanvas = document.createElement("div");
        this.elCanvas.classList.add(PAGE_CLASS_NAMES.CANVAS);
        this.el.appendChild(this.elCanvas);

        this.elCanvasOverlay = document.createElement("div");
        this.elCanvasOverlay.classList.add(PAGE_CLASS_NAMES.CANVAS_OVERLAY);
        this.elCanvas.appendChild(this.elCanvasOverlay);

        // Bind 一 Handlers
        this.__destroy = this.__destroy.bind(this);
        this.__windowScrollHandler = debounce(
            this.__windowScrollHandler.bind(this),
            50,
        );
        this.__windowResizeHandler = this.__windowResizeHandler.bind(this);
        this.__intersectionObserverHandler =
            this.__intersectionObserverHandler.bind(this);

        // Init 一 EventListeners
        this.__intersectionObserver = new IntersectionObserver(
            this.__intersectionObserverHandler,
        );

        this.elButtonDelete.addEventListener('click', this.__destroy);
        document.addEventListener("scroll", this.__windowScrollHandler);
    }

    enable() {
        this.isActive = true;
        PagesStore.activePages.set(this.id, this.id);
    }

    disable() {
        this.isActive = false;
        PagesStore.activePages.delete(this.id, this.id);
    }

    computeBoundings() {
        this.boundings = this.elCanvas.getBoundingClientRect();
    }

    initIntersectionObserver() {
        this.__intersectionObserver.observe(this.el);
    }

    onResize() {
        if (!this.el) return;

        return this.__windowResizeHandler();
    }

    __windowResizeHandler() {
        return this.computeBoundings();
    }

    __windowScrollHandler() {
        return this.computeBoundings();
    }

    __intersectionObserverHandler(entries) { // I NEED TO FIX THIS - WIP!
        if (entries[0].isIntersecting) {
            this.enable();
            this.el.style.visibility = "visible";
        } else {
            this.disable();
            this.el.style.visibility = "hidden";
        }
    }

    __destroy() {
        // Disconnect page from IntersectionObserver
        this.__intersectionObserver.unobserve(this.el);
        this.__intersectionObserver.disconnect();
        this.__intersectionObserver = null;

        // Delete all the page references
        PagesStore.activePages.delete(this.id);
        PagesStore.pages.delete(this.id);

        // Delete all the elements inside the page
        ElementsStore.elements.forEach(el => (this.id == el.pageId) && el.__destroy());

        // Remove all the DOMElements
        this.elButtonDelete.removeEventListener("click", this.__destroy);
        this.elButtonDelete.remove();
        this.elButtonDelete = null;

        this.elTag.remove();
        this.elTag = null;

        this.el.remove();
        this.el = null;

        // Remove all the listeners attach to this page
        document.removeEventListener("scroll", this.__windowScrollHandler);

        // Recompute the boundings for the pages
        this.parentRef.recalculatePages();

        this.destroy();

        PageDebugger.updateStats(ElementsStore.elements.size);

        return;
    }
}
