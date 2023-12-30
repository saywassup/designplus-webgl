import { html, render } from "lit-html";
import gsap from "gsap/gsap-core";
import { Vec2D } from "../utils/Vec2D";
import { viewport } from "../emitters/viewport";
import { pointer } from "../emitters/pointer";
import { component } from "bidello";
import { Element } from "../classes/Element";

export const BOX_BOUNDINGS = {
    WIDTH: 100,
    HEIGHT: 100
};

export const BOX_CLASS_NAMES = {
    EL: "box",
    BORDER: "box__border",
    GRABBER: "box__grabber",
    GRABBER_FREE: "box__grabber--free",
    GRABBER_CONTAIN: "box__grabber--contain",
    GRABBER_ROTATION: "box__grabber--rotation"
};

export const BOX_IDS = {
    GRABBER: {
        CONTAINER: 'BOX.CONTAINER',

        ROTATE: 'GRABBER.ROTATE',

        CONTAIN_TOP_LEFT: 'GRABBER.CONTAIN.TOP_LEFT',
        CONTAIN_TOP_RIGHT: 'GRABBER.CONTAIN.TOP_RIGHT',
        CONTAIN_BOTTOM_LEFT: 'GRABBER.CONTAIN.BOTTOM_LEFT',
        CONTAIN_BOTTOM_RIGHT: 'GRABBER.CONTAIN.BOTTOM_RIGHT',
        
        FREE_TOP_LEFT: 'GRABBER.FREE.TOP_LEFT',
        FREE_TOP_RIGHT: 'GRABBER.FREE.TOP_RIGHT',
        FREE_BOTTOM_LEFT: 'GRABBER.FREE.BOTTOM_LEFT',
        FREE_BOTTOM_RIGHT: 'GRABBER.FREE.BOTTOM_RIGHT',
    }
};

// 1.Scale   2.Rotate   3.Translate

// translate(var(--x), var(--y)) rotate(0) scale(var(--scale))

// FIRST_ACTIVE_ELEMENT.X - (BOX_WIDTH * BOX_SCALE)
// FIRST_ACTIVE_ELEMENT.Y - (BOX_HEIGHT * BOX_SCALE)

class _BoxElement extends Element {
    constructor() {
        super();

        // Init 一 DOMElements
        this.el = html`
            <div id="${BOX_IDS.GRABBER.CONTAINER}" class="${BOX_CLASS_NAMES.EL}">
                <div id="${BOX_IDS.GRABBER.ROTATE}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_ROTATION}">
                    <div class="${BOX_CLASS_NAMES.GRABBER_ROTATION}-icon"></div>
                </div>
                
                <div id="${BOX_IDS.GRABBER.FREE_TOP_LEFT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
                <div id="${BOX_IDS.GRABBER.FREE_TOP_RIGHT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
                <div id="${BOX_IDS.GRABBER.FREE_BOTTOM_LEFT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
                <div id="${BOX_IDS.GRABBER.FREE_BOTTOM_RIGHT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
            </div>
        `;

        this.raf = this.raf.bind(this);

        this.rotatePointerDown = this.rotatePointerDown.bind(this);
        this.scalePointerDown = this.scalePointerDown.bind(this);
    }

    renderIn(container) {
        render(this.el, container);

        this.$el = document.getElementById(BOX_IDS.GRABBER.CONTAINER);

        this.isReady.resolve();

        this.getElementsById(BOX_IDS.GRABBER);

        this[BOX_IDS.GRABBER.ROTATE].addEventListener("pointerdown", this.rotatePointerDown);
        this[BOX_IDS.GRABBER.FREE_TOP_LEFT].addEventListener("pointerdown", this.scalePointerDown);
        this[BOX_IDS.GRABBER.FREE_TOP_RIGHT].addEventListener("pointerdown", this.scalePointerDown);
        this[BOX_IDS.GRABBER.FREE_BOTTOM_LEFT].addEventListener("pointerdown", this.scalePointerDown);
        this[BOX_IDS.GRABBER.FREE_BOTTOM_RIGHT].addEventListener("pointerdown", this.scalePointerDown);

        this.isActive = true;
    }

    scalePointerDown() {
        this.isScaling = true;
    }

    rotatePointerDown() {
        this.isRotating = true;
    }

    rotateCallback() {
        
    }

    raf() {
        this.$el.style.width = `${this.dimensions.width}px`;
        this.$el.style.height = `${this.dimensions.height}px`;
    }
}

export const BoxElement = new _BoxElement();