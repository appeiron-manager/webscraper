"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperController = void 0;
const common_1 = require("@nestjs/common");
const images_source_dto_1 = require("../interfaces/dto/images-source.dto");
const Browser_1 = require("./models/Browser");
let ScraperController = class ScraperController {
    async mainScrape() {
        const mainAppPageUrl = 'https://www.pedidosya.com.pa/';
        const browser = new Browser_1.Browser('main');
        await browser.launch();
        const context = await browser.newContext('main', 'default');
        const page = await context.newPage('main', mainAppPageUrl);
        await page.initialize();
        await page.requestInterception(true);
        await page.interceptRequestsOn('image');
        await page.loadPage();
        await page.click('#selectArea_chosen');
        await page.waitForTimeout(500);
        await page.pressKeyboard('ArrowDown');
        await page.pressKeyboard('Enter');
        const searchMap = await page.searchElement('#searchMap');
        await Promise.all([
            page.click('#search'),
            page.waitForTimeout(500)
        ]);
        await page.clickOnElement(searchMap);
        await page.waitForTimeout(500);
        await page.waitForSelectorLoaded('#confirm', true);
        await Promise.all([
            page.waitForNavigation(),
            page.click('#confirm')
        ]);
        const businessLinks = [];
        try {
            let hasMorePages = true;
            while (hasMorePages) {
                const items = await page.searchAllElements('a.arrivalName');
                items.forEach(async (item) => {
                    const href = await item.evaluate(node => { return node.getAttribute('href'); });
                    businessLinks.push(href);
                });
                const nextPageButton = await page.searchElement('.arrow.next');
                if (!nextPageButton) {
                    hasMorePages = false;
                }
                else {
                    await Promise.all([
                        nextPageButton.click(),
                        page.waitForNavigation()
                    ]);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        await page.screenshot("example1.png");
        console.info(businessLinks[0]);
        const businessPage = await context.newPage('businessPage', businessLinks[0]);
        await businessPage.initialize();
        await Promise.all([
            businessPage.loadPage(),
            businessPage.waitForNavigation(),
            businessPage.bringToFront(),
        ]);
        await businessPage.screenshot("example2.png");
        browser.close();
    }
    async getImages(imagesSourceDto) {
        let links = [];
        const browser = new Browser_1.Browser('main');
        browser.launch();
        const context = await browser.newContext('main', 'default');
        const page = await context.newPage('imagesPate', imagesSourceDto.urlSource);
        links = await page.getImagesUrls();
        await page.loadPage();
        console.log("ScraperController -> links.length", links.length);
        browser.close();
    }
};
__decorate([
    common_1.Get('/main-scrape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScraperController.prototype, "mainScrape", null);
ScraperController = __decorate([
    common_1.Controller('scraper')
], ScraperController);
exports.ScraperController = ScraperController;
//# sourceMappingURL=scraper.controller.js.map