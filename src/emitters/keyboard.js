import bidello from 'bidello';

export const KEYBOARD_ACTION = {
    jump: 'jump',
    run: 'run',
    walk: 'walk',
    forward: 'forward',
    backward: 'backward',
    left: 'left',
    right: 'right'
};

export const KEYBOARD_EVENT = {
    keyup: 'keyup',
    keydown: 'keydown'
};

class Keyboard {
    constructor() {
        this.direction = [1, 1];

        this.bind();
    }

    bind() {
        const container = window;
  
        container.addEventListener(KEYBOARD_EVENT.keyup, this.onKeyUp.bind(this));
        container.addEventListener(KEYBOARD_EVENT.keydown, this.onKeyDown.bind(this));
    }

    convertEvent(event) {
        let action = '';

        switch(event.keyCode) {
            case 16:
                action = KEYBOARD_ACTION.run;
                break;

            case 32:
                action = KEYBOARD_ACTION.jump;
                break;

            case 38:
            case 87:
                action = KEYBOARD_ACTION.forward;
                this.direction[1] = 1;
                break;
            
            case 37:
            case 65:
                action = KEYBOARD_ACTION.left;
                this.direction[0] = -1;
                break;

            case 68:
            case 39:
                action = KEYBOARD_ACTION.right;
                this.direction[0] = 1;
                break;

            case 83:
            case 40:
                action = KEYBOARD_ACTION.backward;
                this.direction[1] = -1;
                break;
        }

        return ({ action, direction: this.direction, keyCode: event.keyCode });
    }

    onKeyUp(event) {
        let ev = this.convertEvent(event);

        bidello.trigger({ name: 'keyUp' }, ev);
    }

    onKeyDown(event) {
        let ev = this.convertEvent(event);

        bidello.trigger({ name: 'keyDown' }, ev);
    }
}

export const keyboard = new Keyboard();