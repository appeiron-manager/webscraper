import { Browser as PuppeteerBrowser } from "puppeteer";
import { BrowserContext } from './BrowserContext';
export declare class Browser {
    puppeteerBrowser: PuppeteerBrowser;
    contexts: BrowserContext[];
    name: string;
    constructor(name: string);
    launch(): Promise<void>;
    close(): void;
    newContext(name: string, type: string): Promise<BrowserContext>;
}
