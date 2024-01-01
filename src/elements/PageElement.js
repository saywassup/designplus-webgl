const { v4: uuidv4 } = require("uuid");

import * as PIXI from 'pixi.js';

import { component } from "bidello";

import debounce from "lodash.debounce";
import { viewport } from "../emitters/viewport";
import { PageDebugger } from "../PageDebugger";

// Store
import { PagesStore } from "../store/PagesStore";
import { ElementsStore } from "../store/ElementsStore";


/**
 * TODO: INITIALIZE A PAGE STORE WHEN INSTANCIATE A PAGE ELEMENT
 */

export class PageElement extends component(PIXI.Container) {
    constructor({ 
        x = 0, 
        y = 0, 
        width = 746, 
        height = 746
    } = {}) {
        super();

        // Init 一 Variables
        this.id = uuidv4();

        // Init 一 Elements
        this.radius = 12;

        this.pageMask = new PIXI.Graphics();
        this.pageGraphics = new PIXI.Graphics();

        this.pageMask.beginFill('transparent', 1);
        this.pageMask.drawRoundedRect(this.x, this.y, width, height, this.radius);
        this.pageMask.endFill();

        this.pageGraphics.beginFill(0xEAEAEA, 1);
        this.pageGraphics.drawRoundedRect(this.x, this.y, width, height, this.radius);
        this.pageGraphics.endFill();

        this.mask = this.pageMask;

        this.x = x;
        this.y = y;

        this.addChild(this.pageMask);
        this.addChild(this.pageGraphics);

        // Register 一 PageStore
        PagesStore.pages.set(this.id, this);
    }
}
