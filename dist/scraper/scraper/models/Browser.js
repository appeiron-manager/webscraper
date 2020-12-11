"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Browser = void 0;
const BrowserContext_1 = require("./BrowserContext");
const puppeteer = require("puppeteer");
class Browser {
    constructor(name) {
        this.name = name;
        this.contexts = [];
    }
    async launch() {
        this.puppeteerBrowser = await puppeteer.launch();
    }
    close() {
        this.puppeteerBrowser.close();
    }
    async newContext(name, type) {
        const context = await new BrowserContext_1.BrowserContext(name, type, this.puppeteerBrowser);
        this.contexts.push(context);
        return context;
    }
}
exports.Browser = Browser;
//# sourceMappingURL=Browser.js.map