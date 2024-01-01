import { component } from "bidello";

class _ElementsStore extends component() {
    constructor() {
        super();

        this.__elements = new Map();
        this.__activeElements = new Map();

        console.log(this);
    }

    get elements() {
        return this.__elements;
    }

    get activeElements() {
        return this.__activeElements;
    }
}

export const ElementsStore = new _ElementsStore();