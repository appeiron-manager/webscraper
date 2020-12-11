/// <reference types="node" />
import { Page as PuppeteerPage, BrowserContext as PuppeteerBrowserContext, ElementHandle } from "puppeteer";
import { ResourceType } from 'src/scraper/interfaces/ResourceType';
export declare class Page {
    puppeteerPage: PuppeteerPage;
    puppeteerBrowserContext: PuppeteerBrowserContext;
    name: string;
    url: string;
    constructor(name: string, url: string, puppeteerBrowserContext: PuppeteerBrowserContext);
    initialize(): Promise<void>;
    loadPage(): Promise<void>;
    requestInterception(state: boolean): Promise<void>;
    interceptRequestsOn(type: ResourceType): Promise<void>;
    getImagesUrls(): Promise<string[]>;
    click(elementName: string): Promise<void>;
    waitForTimeout(milliseconds: number): Promise<void>;
    pressKeyboard(keyName: string): Promise<void>;
    searchElement(elementName: string): Promise<ElementHandle<Element>>;
    searchAllElements(elementName: string): Promise<ElementHandle[]>;
    waitForSelectorLoaded(selectorName: string, isVisible: boolean): Promise<void>;
    waitForNavigation(): Promise<void>;
    bringToFront(): Promise<void>;
    screenshot(pathName: string): Promise<Buffer>;
    clickOnElement(element: ElementHandle<Element>): Promise<void>;
}
