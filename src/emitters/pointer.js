import bidello from 'bidello';
import { Vec2D } from '../utils/Vec2D';
import { clamp } from 'math-toolbox';
import { viewport } from './viewport';

class Pointer {
    constructor() {
        this.x = 0;
        this.xClamped = 0;

        this.y = 0;
        this.yClamped = 0;

        this.isTouching = false;

        this.distance = 0;

        this.hold = new Vec2D();
        this.last = new Vec2D();
        this.delta = new Vec2D();
        this.move = new Vec2D();
        this.normalized = new Vec2D();

        this.bind();
    }

    bind() {
        const container = window;

        this.angleTo = this.angleTo.bind(this);

        container.addEventListener('touchstart', this.onStart.bind(this), { passive: false });
        container.addEventListener('touchmove', this.onMove.bind(this), { passive: false });
        container.addEventListener('touchend', this.onEnd.bind(this), { passive: false });
        container.addEventListener('touchcancel', this.onEnd.bind(this), { passive: false });

        container.addEventListener('mousedown', this.onStart.bind(this));
        container.addEventListener('mousemove', this.onMove.bind(this));
        container.addEventListener('mouseup', this.onEnd.bind(this));
        container.addEventListener('contextmenu', this.onEnd.bind(this));
    }

    convertEvent(e) {
        e.stopPropagation();

        const t = {
            x: 0,
            y: 0,
        };

        if (!e) {
            return t;
        }

        if (e.windowsPointer) {
            return e;
        }

        if (e.touches || e.changedTouches) {
            if (e.touches.length) {
                t.x = e.touches[0].pageX;
                t.y = e.touches[0].pageY;
            } else {
                t.x = e.changedTouches[0].pageX;
                t.y = e.changedTouches[0].pageY;
            }
        } else {
            t.x = e.pageX;
            t.y = e.pageY;
        }

        t.xClamped = clamp(0, viewport.width, t.x);
        t.yClamped = clamp(0, viewport.height, t.y);

        return t;
    }

    onStart(event) {
        const e = this.convertEvent(event);

        this.isTouching = true;

        this.xClamped = e.xClamped;
        this.yClamped = e.yClamped;

        this.x = e.x;
        this.y = e.y;

        this.hold.set(e.x, e.y);
        this.last.set(e.x, e.y);
        this.delta.set(0, 0);
        this.move.set(0, 0);

        this.normalized.x = ((this.xClamped / viewport.width) * 2) - 1;
        this.normalized.y = (-(this.yClamped / viewport.height) * 2) + 1;

        this.distance = 0;

        bidello.trigger({ name: 'pointerStart' }, this);
    }

    onMove(event) {
        const e = this.convertEvent(event);

        if (this.isTouching) {
            this.move.x = e.x - this.hold.x;
            this.move.y = e.y - this.hold.y;
        }

        this.xClamped = e.xClamped;
        this.yClamped = e.yClamped;

        this.x = e.x;
        this.y = e.y;

        this.delta.x = e.x - this.last.x;
        this.delta.y = e.y - this.last.y;

        this.distance += this.delta.len();

        this.normalized.x = (this.xClamped / viewport.width) * 2 - 1;
        this.normalized.y = -(this.yClamped / viewport.height) * 2 + 1;

        bidello.trigger({ name: 'pointerMove' }, this);

        if (this.isTouching) {
            bidello.trigger({ name: 'pointerDrag' }, this);
        }
    }

    onEnd() {
        this.isTouching = false;
        this.move.set(0, 0);

        bidello.trigger({ name: 'pointerEnd' }, this);
    }

    angleTo(position = new Vec2D()) {
        let angleInDegrees = 0,
            angleInRadians = 0;

        let distX, distY;

        if (this.isTouching) {
            distX = (this.x - viewport.scroll.x) - position.x;
            distY = (this.y - viewport.scroll.y) - position.y;

            angleInRadians = Math.atan2(distX, -distY);
            angleInDegrees = angleInRadians * (180 / Math.PI);
            // angleInDegrees = ((((angleInDegrees) % 360) + 540) % 360) - 180;
        }

        return { angleInDegrees, angleInRadians };
    }
}

export const pointer = new Pointer();