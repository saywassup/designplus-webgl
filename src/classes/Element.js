const { v4: uuidv4 } = require("uuid");

import { component } from "bidello";

import { Vec2D } from "../utils/Vec2D";

import { viewport } from "../emitters/viewport";
import { pointer } from "../emitters/pointer";

import gsap from "gsap/gsap-core";
import deferred from "../utils/deferred";
import { clamp } from "math-toolbox";



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

export class Element extends component() {
    constructor({
        pageId = null,
        position = new Vec2D(0),
        dimensions = new Vec2D(100),
        rotation = 0
    } = {}) {
        super();

        this.isReady = deferred();

        this.__$el = null;

        this.id = uuidv4();
        this.pageId = pageId;

        this.isActive = false;
        this.isMoving = false;
        this.isScaling = false;
        this.isRotating = false;
        this.isLocked = false;
        this.isSelected = false;
        this.isVisible = false;

        this.speedScaling = 1;
        this.speedMoving = 1;
        this.speedRotating = 1;

        this.__tempRot = {};
        this.__rotation = rotation;
        this.__targetRotation = rotation;

        this.__dimensions = dimensions;
        this.__targetDimensions = dimensions;

        this.__position = position;
        this.__targetPosition = position;

        this.__boundings = {};

        this.computeBoundings = this.computeBoundings.bind(this);
        this.getElementsById = this.getElementsById.bind(this);

        this.__move = this.__move.bind(this);
        this.__rotate = this.__rotate.bind(this);
        this.__scale = this.__scale.bind(this);
        this.__destroy = this.__destroy.bind(this);
        this.__raf = this.__raf.bind(this);
    }

    async init() {
        await this.isReady;

        // Enable RAF
        gsap.ticker.add(this.__raf);
    }

    // getters/setters
    get $el() {
        return this.__$el;
    }

    set $el(element) {
        this.__$el = element;
        this.computeBoundings();
    }

    get dimensions() {
        return this.__dimensions;
    }

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
    async computeBoundings() {
        await this.isReady;

        this.boundings = this.__$el.getBoundingClientRect();
    }

    async getElementsById(dictionary) {
        for (let prop in dictionary) {
            let el = document.getElementById(dictionary[prop]);

            if (el) {
                this[dictionary[prop]] = el;
            }
        }
    }
    
    // Public Override Methods
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
        console.log(pointer)
        let x = clamp(-1, 1, pointer.move.x);
        let y = clamp(-1, 1, pointer.move.y);

        this.__targetDimensions.width += x;
        this.__targetDimensions.height += y;

        this.scaleCb();
    }

    __move() {
        if (this.pageId) {
            this.__targetPosition.x = pointer.x - (this.page.boundings.x + (this.__dimensions.width / 2));
            this.__targetPosition.y = pointer.y - (this.page.boundings.y + (this.__dimensions.height / 2)) - viewport.scroll.y;
        } else {
            this.__targetPosition.x = pointer.x - (this.dimensions.width / 2);
            this.__targetPosition.y = pointer.y - (this.dimensions.height / 2) - viewport.scroll.y;
        }

        this.moveCb();
    }

    __destroy() {
        return;
    }

    __raf() {
        if (!this.isActive || !this.__$el) return;

        // Compute Dimensions
        this.__dimensions.width += (this.__targetDimensions.width - this.__dimensions.width) * this.speedScaling;
        this.__dimensions.height += (this.__targetDimensions.height - this.__dimensions.height) * this.speedScaling;

        // Compute Positions
        this.__position.x += (this.__targetPosition.x - this.__position.x) * this.speedMoving;
        this.__position.y += (this.__targetPosition.y - this.__position.y) * this.speedMoving;

        // Compute Rotation
        this.__rotation += (this.__targetRotation - this.__rotation) * this.speedRotating;

        // Apply Transformations
        this.__$el.style.transform = `translate(${this.__position.x}px, ${this.__position.y}px) rotate(${this.__rotation}deg) scale(1, 1)`;

        // Call Custom RAF
        this.raf();
    }
}