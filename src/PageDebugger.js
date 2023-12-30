import { getGPUTier } from 'detect-gpu';

export const DEBUGGER_CLASS_NAMES = {
    EL: "page-debugger",
    FORM: "page-debugger__form",
    INPUT_PAGE_NUMBER: "page-debugger__form-input--pages",
    INPUT_ELEMENTS_NUMBER: "page-debugger__form-input--elements",
    BUTTON_CREATE_PAGES: "page-debugger__form-button--create",
    BUTTON_ADD_PAGE: "page-debugger__form-button--add",
    STATS_TOTAL: "page-debugger__stats-total"
};

class __PageDebugger {
    constructor() {
        this.NUMBER_OF_PAGES = 4;
        this.NUMBER_OF_ELEMENTS_PER_PAGE = 20;

        this.__onSubmitHandler = this.__onSubmitHandler.bind(this);
        this.__onCreatePagesHandler = this.__onCreatePagesHandler.bind(this);
        this.__onAddPageHandler = this.__onAddPageHandler.bind(this);

        this.initDOMElements();
        this.initEventListeners();

        console.log(this);
    }

    initDOMElements() {
        for (let key in DEBUGGER_CLASS_NAMES) {
            this[key] = document.querySelector(`.${DEBUGGER_CLASS_NAMES[key]}`);
        }
    }

    initEventListeners() {
        this.BUTTON_ADD_PAGE.addEventListener('click', this.__onAddPageHandler);
        this.BUTTON_CREATE_PAGES.addEventListener('click', this.__onCreatePagesHandler);
    }

    updateVariables() {
        this.NUMBER_OF_PAGES = this.INPUT_PAGE_NUMBER.value;
        this.NUMBER_OF_ELEMENTS_PER_PAGE = this.INPUT_ELEMENTS_NUMBER.value;
    }

    updateStats(total) {
        this.STATS_TOTAL.innerHTML = total;
    }

    cbSubmitHandler() { }

    __onSubmitHandler(ev) {
        console.log(ev)
        this.cbSubmitHandler();
    }

    cbCreatePagesHandler() { }

    __onCreatePagesHandler() {
        this.updateVariables();
        this.cbCreatePagesHandler();
    }

    cbAddPageHandler() { }

    __onAddPageHandler() {
        this.updateVariables();
        this.cbAddPageHandler();
    }

    // PERFORMANCE SCREEN

    detect(match) {
        return this.agent.includes(match)
    }

    async system() {
        this.gpuTier = await getGPUTier();

        this.agent = navigator.userAgent.toLowerCase();

        this.system = {};

        this.system.os = (function() {
            if (this.detect(['ipad', 'iphone', 'ios'])) return 'ios';
            if (this.detect(['android', 'kindle'])) return 'android';
            if (this.detect(['blackberry'])) return 'blackberry';
            if (this.detect(['mac os'])) return 'mac';
            if (this.detect(['windows', 'iemobile'])) return 'windows';
            if (this.detect(['linux'])) return 'linux';
            return 'unknown';
        })();

        this.system.browser = (function() {
            if (this.system.os == 'ios') {
                if (this.detect(['twitter', 'fbios', 'instagram'])) return 'social';
                if (this.detect(['crios'])) return 'chrome';
                if (this.detect(['fxios'])) return 'firefox';
                if (this.detect(['safari'])) return 'safari';
                return 'unknown';
            }
            if (this.system.os == 'android') {
                if (this.detect(['twitter', 'fb', 'facebook', 'instagram'])) return 'social';
                if (this.detect(['chrome'])) return 'chrome';
                if (this.detect(['firefox'])) return 'firefox';
                return 'browser';
            }
            if (this.detect(['msie'])) return 'ie';
            if (this.detect(['trident']) && this.detect(['rv:'])) return 'ie';
            if (this.detect(['windows']) && this.detect(['edge'])) return 'ie';
            if (this.detect(['chrome'])) return 'chrome';
            if (this.detect(['safari'])) return 'safari';
            if (this.detect(['firefox'])) return 'firefox';
    
            return 'unknown';
        })();

        this.system.browserVersion = (function() {
            try {
                if (this.system.browser == 'chrome') {
                    if (this.detect('crios')) return Number(this.agent.split('crios/')[1].split('.')[0]);
                    return Number(this.agent.split('chrome/')[1].split('.')[0]);
                }
                if (this.system.browser == 'firefox') return Number(this.agent.split('firefox/')[1].split('.')[0]);
                if (this.system.browser == 'safari') return Number(this.agent.split('version/')[1].split('.')[0].split('.')[0]);
                if (this.system.browser == 'ie') {
                    if (this.detect(['msie'])) return Number(this.agent.split('msie ')[1].split('.')[0]);
                    if (this.detect(['rv:'])) return Number(this.agent.split('rv:')[1].split('.')[0]);
                    return Number(this.agent.split('edge/')[1].split('.')[0]);
                }
            } catch(e) {
                return -1;
            }
        })();
    }

    renderPerformanceDetails() {
        let html = `<h1>Performance Results</h1>
                    <p><b>Time:</b> ${new Date()}</p>
                    <p><b>GPU:</b> ${this.graphics.webgl ? this.graphics.webgl.gpu : 'WEBGL UNAVAILABLE'}</p>
                    <p><b>WebGL Version:</b> ${this.graphics.webgl ? this.graphics.webgl.version : 'WEBGL UNAVAILABLE'}</p>
                    <p><b>GPU Tier:</b> ${this.gpuTier}</p>
                    <p><b>User Agent:</b> ${this.agent}</p>
                    <p><b>OS:</b> ${this.system.os}</p>${this.system.version !== -1 ? `
                    <p><b>OS Version:</b> ${this.system.version}` : ''}
                    <p><b>DPR:</b> ${this.pixelRatio}</p>
                    <p><b>Screen Size:</b> ${screen.width} x ${screen.height}</p>
                    <p><b>Stage Size:</b> ${Stage.width} x ${Stage.height}</p>
                    <p><b>Browser:</b> ${this.system.browser}</p>
                    <p><b>Browser Version:</b> ${this.system.browserVersion}</p>`;
    }
}

export const PageDebugger = new __PageDebugger();