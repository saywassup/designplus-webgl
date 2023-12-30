import debounce from "lodash.debounce";
import { viewport } from "../emitters/viewport";
import { html } from "lit-html";

export const BOX_BOUNDINGS = {};

export const BOX_CLASS_NAMES = {
    EL: "box",
    BORDER: "box__border",
    GRABBER: "box__grabber",
    GRABBER_FREE: "box__grabber--free",
    GRABBER_CONTAIN: "box__grabber--contain",
    ROTATION: "box__rotation"
};

export const BOX_IDS = {
    GRABBER: {
        CONTAIN: {
            TOP_LEFT: 'GRABBER.CONTAIN.TOP_LEFT',
            TOP_RIGHT: 'GRABBER.CONTAIN.TOP_RIGHT',
            BOTTOM_LEFT: 'GRABBER.CONTAIN.BOTTOM_LEFT',
            BOTTOM_RIGHT: 'GRABBER.CONTAIN.BOTTOM_RIGHT',
        },
        FREE: {
            TOP_LEFT: 'GRABBER.FREE.TOP_LEFT',
            TOP_RIGHT: 'GRABBER.FREE.TOP_RIGHT',
            BOTTOM_LEFT: 'GRABBER.FREE.BOTTOM_LEFT',
            BOTTOM_RIGHT: 'GRABBER.FREE.BOTTOM_RIGHT',
        }
    }
};

class _SelectionElement {
    constructor() {
        this.isActive = false;
        this.boundings = {};

        // Init 一 DOMElements
        this.el = html`
            <div class="${BOX_CLASS_NAMES.EL}">
                <div id="${BOX_IDS.GRABBER.FREE.TOP_LEFT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
                <div id="${BOX_IDS.GRABBER.FREE.TOP_RIGHT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
                <div id="${BOX_IDS.GRABBER.FREE.BOTTOM_LEFT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
                <div id="${BOX_IDS.GRABBER.FREE.BOTTOM_RIGHT}" class="${BOX_CLASS_NAMES.GRABBER} ${BOX_CLASS_NAMES.GRABBER_FREE}"></div>
            </div>
        `;

        console.log(this);
    }

    enable() {
        this.isActive = true;
    }

    disable() {
        this.isActive = false;
    }

    computeBoundings() {
        this.boundings = this.el.getBoundingClientRect();
    }

    __destroy() {

        return;
    }
}

export const SelectionElement = new _SelectionElement();