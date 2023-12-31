import "./styles.scss";

import * as PIXI from 'pixi.js';

// Init Singletons
import * as emitters from './emitters/index';

import { Device } from './utils/Device';

class App {
    constructor() {
        this.__pages = [];
        this.__elements = [];

        this.initRenderer();
        this.initPage();
        this.initSquareElements();

        console.log(this);
    }

    async initRenderer() {
        await Device.isReady;

        this.context = new PIXI.Application({ 
            background: '#FAFAFA', 
            resizeTo: window, 
            antialias: (Device.gpu.tier >= 2) 
        });

        document.body.appendChild(this.context.view);

        this.container = new PIXI.Container();
        this.context.stage.addChild(this.container);
    }

    async initPage() {
        await Device.isReady;

        let radius = 12;
        let size = 746;
        let x = (emitters.viewport.width / 2) - (size / 2);
        let y = (emitters.viewport.height / 2)  - (size / 2);

        this.page = new PIXI.Container();
        this.container.addChild(this.page);

        let pageMask = new PIXI.Graphics();
        let pageGraphics = new PIXI.Graphics();

        pageMask.beginFill('transparent', 1);
        pageMask.drawRoundedRect(x, y, size, size, radius);
        pageMask.endFill();

        pageGraphics.beginFill(0xEAEAEA, 1);
        pageGraphics.drawRoundedRect(x, y, size, size, radius);
        pageGraphics.endFill();

        this.page.mask = pageMask;

        this.page.addChild(pageMask);
        this.page.addChild(pageGraphics);
    }

    async initSquareElements() {
        await Device.isReady;

        let size = 75;
        let x = (emitters.viewport.width / 2) - (size / 2);
        let y = (emitters.viewport.height / 2)  - (size / 2);

        let squareGraphics = new PIXI.Graphics();

        squareGraphics.beginFill(0x2C52E5, 1);
        squareGraphics.drawRoundedRect(x, y, size, size, 15);
        squareGraphics.endFill();

        this.page.addChild(squareGraphics);

        console.log(squareGraphics)
    }
}

new App();
