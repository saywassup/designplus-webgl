import "./styles.scss";

import { Device } from './utils/Device';

import * as PIXI from 'pixi.js';

// Init Singletons
import * as emitters from './emitters/index';

import { ElementsStore } from "./store/ElementsStore";
import { PagesStore } from "./store/PagesStore";

import { PageElement } from "./elements/PageElement";
import { SquareElement } from "./elements/SquareElement";
import { RendererContext } from "./controllers/AppContext";
import { randomInt } from "math-toolbox";

class App {
    constructor() {
        this.initRenderer();
        this.initPage();
        this.initSquareElements();

        console.log(this);        
    }

    async initRenderer() {
        document.body.appendChild((await RendererContext).view);

        this.container = new PIXI.Container();
        (await RendererContext).stage.addChild(this.container);

        console.log((await RendererContext));
    }

    async initPage() {
        await RendererContext;

        let width = 746;
        let height = 746;

        let x = (emitters.viewport.width / 2) - (width / 2);
        let y = (emitters.viewport.height / 2)  - (height / 2);

        this.page = new PageElement({ x, y, width, height });
        
        this.container.addChild(this.page);
    }

    async initSquareElements() {
        await RendererContext;

        const MAX_SQUARES = 200;

        let width = 75;
        let height = 75;

        for (let i = 0; i < MAX_SQUARES; i++) {
            let square = new SquareElement({ 
                pageId: this.page.id,
                x: randomInt(0, (this.page.width) - (width)),
                y: randomInt(0, (this.page.height) - (height)),
            });
    
            this.page.addChild(square);
        }
    }
}

new App();
