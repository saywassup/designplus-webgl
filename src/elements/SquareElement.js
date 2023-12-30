const { v4: uuidv4 } = require("uuid");

import gsap from "gsap/gsap-core";
import { pointer } from "../emitters/pointer";
import { Vec2D } from "../utils/Vec2D";
import { viewport } from "../emitters/viewport";
import { PageDebugger } from "../PageDebugger";

// Components
import { BoxElement } from "../components/BoxElement";

// Store
import { ElementsStore } from "../store/ElementsStore";
import { PagesStore } from "../store/PagesStore";
import bidelloSingleton, { component } from "bidello";

export const SQUARE_CONFIG = {
    WIDTH: 5,
    HEIGHT: 5,
};

export const SQUARE_CLASS_NAMES = {
    EL: "square",
    BUTTON_DELETE: "square__delete",
    RESIZER: "square__resizer",
    SHADOW: "square__shadow",
};

export class SquareElement extends component() {
    constructor({ parentRef = null, position = [0, 0], pageId = null } = {}) {
        super();

        // Init 一 Variables
        this.parentRef = parentRef;
        this.id = uuidv4();

        this.pageId = pageId;
        this.page = PagesStore.pages.get(this.pageId);

        this.isActive = false;

        this.position = new Vec2D(...position);
        this.__targetPos = new Vec2D(...position);

        this.dimensions = new Vec2D();

        // bind 一 Handlers
        this.__onPointerUpHandler = this.__onPointerUpHandler.bind(this);
        this.__onPointerDownHandler = this.__onPointerDownHandler.bind(this);

        this.__destroy = this.__destroy.bind(this);
        this.__raf = this.__raf.bind(this);

        this.move = this.move.bind(this);

        // Init 一 DOMElements
        this.initElements();

        bidelloSingleton.unregister(this); // Unregister first to reduce the instance loop

        gsap.ticker.add(this.__raf);
    }

    initElements() {
        this.el = document.createElement("div");
        this.el.id = this.id;
        this.el.classList.add(SQUARE_CLASS_NAMES.EL);
        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

        this.elDelete = document.createElement("div");
        this.elDelete.classList.add(SQUARE_CLASS_NAMES.BUTTON_DELETE);
        this.elDelete.innerHTML = "×";
        this.el.appendChild(this.elDelete);

        this.elShadow = document.createElement("div");
        this.elShadow.classList.add(SQUARE_CLASS_NAMES.SHADOW);
        this.el.appendChild(this.elShadow);

        // Init 一 EventListeners
        this.elDelete.addEventListener("click", this.__destroy);

        this.el.addEventListener("pointerdown", this.__onPointerDownHandler);
    }

    enable() {
        this.isActive = true;
        ElementsStore.activeElements.set(this.id, this.id);

        bidelloSingleton.register(this);
    }

    disable() {
        this.isActive = false;
        ElementsStore.activeElements.delete(this.id);

        bidelloSingleton.unregister(this);
    }

    rotate(pointer) {
        const distanceX = pointer.x - (this.dimensions.width / 2) // adjacent side
        const distanceY = pointer.y - (this.dimensions.height / 2) // opposite side
 
        const angle = Math.atan2(distanceX, -distanceY) * (180 / Math.PI);
    }

    onPointerMove(pointer) {
        if (!this.isActive) return;

        this.move(pointer);
    }

    onPointerEnd(ev) {
        if (!this.isActive) return;

        this.__onPointerUpHandler(ev);
    }

    __onPointerUpHandler() {
        this.disable();

        this.el.style.zIndex = null;
    }

    __onPointerDownHandler(ev) {
        ev.stopPropagation();
        this.enable();

        this.el.style.zIndex = 4;

        BoxElement.__targetDimensions.width = (SQUARE_CONFIG.WIDTH * viewport.fontSize);
        BoxElement.__targetDimensions.height = (SQUARE_CONFIG.HEIGHT * viewport.fontSize);
    }

    __destroy() {
        ElementsStore.elements.delete(this.id);
        ElementsStore.activeElements.delete(this.id);

        this.el.removeEventListener("pointerup", this.__onPointerUpHandler);
        this.el.removeEventListener("pointerdown", this.__onPointerDownHandler);
        this.el.remove();
        this.el = null;

        this.elDelete.removeEventListener("click", this.__destroy);
        this.elDelete.remove();
        this.elDelete = null;

        gsap.ticker.remove(this.__raf);

        PageDebugger.updateStats(ElementsStore.elements.size);

        this.destroy();

        return;
    }

    move(pointer) {
        this.__targetPos.x = pointer.x - (this.page.boundings.x + (SQUARE_CONFIG.WIDTH * viewport.fontSize) / 2);
        this.__targetPos.y = pointer.y - (this.page.boundings.y + (SQUARE_CONFIG.HEIGHT * viewport.fontSize) / 2) - viewport.scroll.y;

        BoxElement.__move();
    }

    __raf() {
        if (!this.isActive) return;

        this.position.x += (this.__targetPos.x - this.position.x);
        this.position.y += (this.__targetPos.y - this.position.y);

        this.el.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
}
