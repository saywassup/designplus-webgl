const { v4: uuidv4 } = require("uuid");

import { Application } from "pixi.js";
import { Device } from "../utils/Device";

export const RendererContext = (async () => {
    await Device.isReady;

    const __APP = new Application({
        background: '#FAFAFA',
        resizeTo: window,
        antialias: (Device.gpu.tier >= 2)
    });

    __APP.id = uuidv4();

    return __APP;
})().then(_ => _);

