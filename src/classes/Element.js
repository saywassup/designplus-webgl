const { v4: uuidv4 } = require("uuid");

import { Container } from "pixi.js";
import gsap from "gsap/gsap-core";
import bidelloSingleton, { component } from "bidello";

import { Vec2D } from "../utils/Vec2D";

import { viewport } from "../emitters/viewport";
import { pointer } from "../emitters/pointer";

import deferred from "../utils/deferred";
import { clamp } from "math-toolbox";
import { ElementsStore } from "../store/ElementsStore";
import { RendererContext } from "../controllers/AppContext";
import { StatsDebugger } from "../utils/StatsDebugger";


/**
         * 
         * Variables:
         *  - rotation
         *  - scale
         *  - position
         *  - boundings
         * 
         * States:
         *  - isActive
         *  - isVisible
         *  - isSelected
         *  - isLocked
         * 
         * Handlers:
         *  - Move
         *  - Rotate // https://www.14islands.com/journal/using-trigonometry-to-animate-direction https://gist.github.com/Flyrell/2a4714255229a33ce6384ada3210d3ae
         *  - Lock
         * 
**/

export class Element extends component(Container) {
    constructor() {
        super();

        this.isReady = deferred();

        this.id = uuidv4();

        this.isActive = false;
        this.isMoving = false;
        this.isScaling = false;
        this.isRotating = false;
        this.isLocked = false;
        this.isSelected = false;

        this.speedScaling = 1;
        this.speedMoving = 1;
        this.speedRotating = 1;

        this.__tempRot = {};
        this.__rotation = 0;
        this.__targetRotation = 0;

        this.__dimensions = new Vec2D();
        this.__targetDimensions = new Vec2D();

        this.__position = new Vec2D();
        this.__targetPosition = new Vec2D();

        this.__move = this.__move.bind(this);
        this.__rotate = this.__rotate.bind(this);
        this.__scale = this.__scale.bind(this);
        this.__destroy = this.__destroy.bind(this);
        this.__raf = this.__raf.bind(this);
    }

    async init() {
        (await RendererContext).ticker.add(this.__raf);
    }

    // getters/setters
    set dimensions(newDimensions = {}) {
        if ('width' in newDimensions) this.__targetDimensions.width = newDimensions.width;
        if ('height' in newDimensions) this.__targetDimensions.height = newDimensions.height;
    }

    get position() {
        return this.__position;
    }

    set position(newPosition = {}) {
        if ('x' in newPosition) this.__targetPosition.x = newPosition.x;
        if ('y' in newPosition) this.__targetPosition.y = newPosition.y;
    }

    get rotation() {
        return this.__rotation;
    }

    set rotation(newRotation = 0) {
        this.__rotation = newRotation;
    }

    // Public Methods
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
    
    // Public Override Methods
    raf() {}
    moveCb() {}
    rotateCb() {}
    scaleCb() {}

    // Global Handlers
    onPointerEnd() {
        if (!this.isActive || this.isLocked) return;

        if (this.isMoving) this.isMoving = false;
        if (this.isRotating) this.isRotating = false;
        if (this.isScaling) this.isScaling = false;
    }

    onPointerMove(ev) {
        if (!this.isActive || this.isLocked) return;

        if (this.isMoving) return this.__move(ev);
        if (this.isRotating) return this.__rotate(ev);
        if (this.isScaling) return this.__scale(ev);
    }

    // Internal Handlers
    __rotate() {
        this.__tempRot.x = this.__position.x + (this.__dimensions.width / 2);
        this.__tempRot.y = this.__position.y + (this.__dimensions.height / 2);

        this.__targetRotation = pointer.angleTo(this.__tempRot).angleInDegrees;

        this.rotateCb();
    }

    __scale() {
        let x = clamp(-1, 1, pointer.move.x);
        let y = clamp(-1, 1, pointer.move.y);

        this.__targetDimensions.width += x;
        this.__targetDimensions.height += y;

        this.scaleCb();
    }

    __move() {
        if (this.pageId) {
            this.__targetPosition.x = pointer.x - (this.page.x + (this.width / 2));
            this.__targetPosition.y = pointer.y - (this.page.y + (this.height / 2)) - viewport.scroll.y;
        } else {
            this.__targetPosition.x = pointer.x - (this.width / 2);
            this.__targetPosition.y = pointer.y - (this.height / 2) - viewport.scroll.y;
        }

        this.moveCb();
    }

    __destroy() {
        return;
    }

    __raf(delta) {
        if (!this.isActive) return;

        // Compute Dimensions
        this.__dimensions.width += (this.__targetDimensions.width - this.__dimensions.width) * this.speedScaling * delta;
        this.__dimensions.height += (this.__targetDimensions.height - this.__dimensions.height) * this.speedScaling * delta;

        // Compute Positions
        this.__position.x += (this.__targetPosition.x - this.__position.x) * this.speedMoving * delta;
        this.__position.y += (this.__targetPosition.y - this.__position.y) * this.speedMoving * delta;

        // Compute Rotation
        this.__rotation += (this.__targetRotation - this.__rotation) * this.speedRotating * delta;

        this.x = this.__position.x;
        this.y = this.__position.y;

        // Call Custom RAF
        this.raf();
    }
}