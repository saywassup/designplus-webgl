import "./styles.scss";

// Init Singletons
import * as emitters from './emitters/index';

import { PagesController } from "./controllers/PagesController";

class App {
    constructor() {
        this.pagesController = new PagesController();
    }
}

new App();
