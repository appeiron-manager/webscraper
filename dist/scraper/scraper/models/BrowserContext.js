"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserContext = void 0;
const Page_1 = require("./Page");
class BrowserContext {
    constructor(type, name, puppeteerBrowser) {
        this.name = name;
        this.type = type;
        this.puppeteerBrowser = puppeteerBrowser;
        this.pages = [];
        this.initialize();
    }
    async initialize() {
        this.puppeteerBrowserContext = await this.puppeteerBrowser.defaultBrowserContext();
    }
    async newPage(name, url) {
        const page = new Page_1.Page(name, url, this.puppeteerBrowserContext);
        this.pages.push(page);
        return page;
    }
    async close() {
        this.puppeteerBrowserContext.close();
    }
}
exports.BrowserContext = BrowserContext;
//# sourceMappingURL=BrowserContext.js.map