import { Browser as PuppeteerBrowser, BrowserContext as PuppeteerBrowserContext } from "puppeteer";
import { Page } from './Page';
export declare class BrowserContext {
    name: string;
    type: string;
    pages: Page[];
    puppeteerBrowserContext: PuppeteerBrowserContext;
    puppeteerBrowser: PuppeteerBrowser;
    constructor(type: string, name: string, puppeteerBrowser: PuppeteerBrowser);
    private initialize;
    newPage(name: string, url: string): Promise<Page>;
    close(): Promise<void>;
}
