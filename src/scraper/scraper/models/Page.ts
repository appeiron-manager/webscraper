import { PageDto } from 'src/scraper/interfaces/dto/page.dto';
import { Page as PuppeteerPage, BrowserContext as PuppeteerBrowserContext, ElementHandle } from "puppeteer";
import { ResourceType } from 'src/scraper/interfaces/ResourceType';
import * as puppeteer from 'puppeteer';


export class Page {
  puppeteerPage: PuppeteerPage;
  puppeteerBrowserContext: PuppeteerBrowserContext;
  name: string;
  url: string;

  constructor(name: string, url: string, puppeteerBrowserContext: PuppeteerBrowserContext){
    this.name = name;
    this.url = url;
    this.puppeteerBrowserContext = puppeteerBrowserContext;
  }

  async initialize(): Promise<void> {
    this.puppeteerPage = await this.puppeteerBrowserContext.newPage();
  }

  async loadPage(): Promise<void> {
    await this.puppeteerPage.goto(this.url);
  }

  async requestInterception(state: boolean): Promise<void>{
    this.puppeteerPage.setRequestInterception(state);
  }

  async interceptRequestsOn(type: ResourceType): Promise<void> {
    this.puppeteerPage.on('request', (request) => {
      if (request.resourceType() !== type) {
          request.continue();
      } else {
          request.abort();
      }
    });
  }

  async getImagesUrls(): Promise<string[]>{
    const links: string[] = [];
    this.puppeteerPage.on('response', async (response) => {
      const matches = /.*\.(jpg|png|svg|gif).(quality).*$/.exec(response.url());
      if (matches) {
        console.log("ScraperController -> matches", matches)
        links.push(matches.input);
      }
    });
    return links;
  }

  async click(elementName: string): Promise<void> {
    await this.puppeteerPage.click(elementName);
  }

  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.puppeteerPage.waitForTimeout(milliseconds);
  }

  async pressKeyboard(keyName: string): Promise<void> {
    await this.puppeteerPage.keyboard.press(keyName);
  }

  async searchElement(elementName: string): Promise<ElementHandle<Element>> {
    return await this.puppeteerPage.$(elementName);
  }

  async searchAllElements(elementName: string): Promise<ElementHandle[]>{
    return await this.puppeteerPage.$$(elementName);
  }

  async waitForSelectorLoaded(selectorName: string, isVisible: boolean): Promise<void> {
    await this.puppeteerPage.waitForSelector(selectorName, {visible: isVisible});
  }

  async waitForNavigation(){
    await this.puppeteerPage.waitForNavigation();
  }

  async bringToFront(): Promise<void>{
    await this.puppeteerPage.bringToFront();
  }

  async screenshot(pathName: string): Promise<Buffer>{
    return await this.puppeteerPage.screenshot({path: pathName});
  }

  async clickOnElement(element: ElementHandle<Element>) {
    const rect = await this.puppeteerPage.evaluate(el => {
      const { top, left, width, height } = el.getBoundingClientRect();
      return { top, left, width, height };
    }, element);

    // Use given position or default to center
    const _x = rect.width / 2;
    const _y = rect.height / 2;

    await this.puppeteerPage.mouse.click(rect.left + _x, rect.top + _y);
  }


}