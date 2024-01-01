import { component } from "bidello";

class _PagesStore extends component() {
    constructor() {
        super();

        this.__pages = new Map();
        this.__activePages = new Map();

        this.__commonPageBoundings = {};

        console.log(this);
    }

    get pages() {
        return this.__pages;
    }

    get activePages() {
        return this.__activePages;
    }

    get pageBoundings() {
        return this.__commonPageBoundings;
    }

    set pageBoundings(boundings) {
        this.__commonPageBoundings = boundings;
    }
}

export const PagesStore = new _PagesStore();