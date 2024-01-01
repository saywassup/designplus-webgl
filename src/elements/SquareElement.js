const { v4: uuidv4 } = require("uuid");

import * as PIXI from 'pixi.js';
import bidelloSingleton, { component } from "bidello";
import gsap from "gsap/gsap-core";

import { pointer } from "../emitters/pointer";
import { Vec2D } from "../utils/Vec2D";
import { viewport } from "../emitters/viewport";
import { PageDebugger } from "../PageDebugger";

import { Element } from '../classes/Element';

// Components
import { BoxElement } from "../components/BoxElement";

// Store
import { ElementsStore } from "../store/ElementsStore";
import { PagesStore } from "../store/PagesStore";
import { RendererContext } from '../controllers/AppContext';

export class SquareElement extends Element {
    constructor({
        pageId = null,
        x = 0,
        y = 0,
        width = 75,
        height = 75
    } = {}) {
        super();

        // Init 一 Variables
        this.pageId = pageId;
        this.page = PagesStore.pages.get(this.pageId);

        // bind 一 Handlers
        this.__onPointerDownHandler = this.__onPointerDownHandler.bind(this);

        // Init 一 Graphics
        let squareGraphics = new PIXI.Graphics();

        squareGraphics.beginFill(0x2C52E5, 1);
        squareGraphics.drawRoundedRect(0, 0, width, height, 15);
        squareGraphics.endFill();

        this.addChild(squareGraphics);

        this.x = x;
        this.y = y;

        this.position = { x, y };

        // Init EventListeners
        this.on('pointerdown', this.__onPointerDownHandler);
        this.eventMode = 'static';

        bidelloSingleton.unregister(this); // Unregister first to reduce the instance loop

        this.isReady.resolve();

        this.isActive = true;
    }

    __onPointerUpHandler() {
        this.disable();
    }

    __onPointerDownHandler() {
        this.enable();
        this.isMoving = true;
    }
}
