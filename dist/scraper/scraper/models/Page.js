"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const page_dto_1 = require("../../interfaces/dto/page.dto");
const ResourceType_1 = require("../../interfaces/ResourceType");
class Page {
    constructor(name, url, puppeteerBrowserContext) {
        this.name = name;
        this.url = url;
        this.puppeteerBrowserContext = puppeteerBrowserContext;
    }
    async initialize() {
        this.puppeteerPage = await this.puppeteerBrowserContext.newPage();
    }
    async loadPage() {
        await this.puppeteerPage.goto(this.url);
    }
    async requestInterception(state) {
        this.puppeteerPage.setRequestInterception(state);
    }
    async interceptRequestsOn(type) {
        this.puppeteerPage.on('request', (request) => {
            if (request.resourceType() !== type) {
                request.continue();
            }
            else {
                request.abort();
            }
        });
    }
    async getImagesUrls() {
        const links = [];
        this.puppeteerPage.on('response', async (response) => {
            const matches = /.*\.(jpg|png|svg|gif).(quality).*$/.exec(response.url());
            if (matches) {
                console.log("ScraperController -> matches", matches);
                links.push(matches.input);
            }
        });
        return links;
    }
    async click(elementName) {
        await this.puppeteerPage.click(elementName);
    }
    async waitForTimeout(milliseconds) {
        await this.puppeteerPage.waitForTimeout(milliseconds);
    }
    async pressKeyboard(keyName) {
        await this.puppeteerPage.keyboard.press(keyName);
    }
    async searchElement(elementName) {
        return await this.puppeteerPage.$(elementName);
    }
    async searchAllElements(elementName) {
        return await this.puppeteerPage.$$(elementName);
    }
    async waitForSelectorLoaded(selectorName, isVisible) {
        await this.puppeteerPage.waitForSelector(selectorName, { visible: isVisible });
    }
    async waitForNavigation() {
        await this.puppeteerPage.waitForNavigation();
    }
    async bringToFront() {
        await this.puppeteerPage.bringToFront();
    }
    async screenshot(pathName) {
        return await this.puppeteerPage.screenshot({ path: pathName });
    }
    async clickOnElement(element) {
        const rect = await this.puppeteerPage.evaluate(el => {
            const { top, left, width, height } = el.getBoundingClientRect();
            return { top, left, width, height };
        }, element);
        const _x = rect.width / 2;
        const _y = rect.height / 2;
        await this.puppeteerPage.mouse.click(rect.left + _x, rect.top + _y);
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map