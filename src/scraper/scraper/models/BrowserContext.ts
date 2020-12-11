import { timingSafeEqual } from "crypto";
import { Browser as PuppeteerBrowser, BrowserContext as PuppeteerBrowserContext} from "puppeteer";
import { Page } from './Page';

export class BrowserContext {
  name: string;
  type: string;
  pages: Page[];
  puppeteerBrowserContext: PuppeteerBrowserContext;
  puppeteerBrowser: PuppeteerBrowser;
  
  constructor(type: string, name: string, puppeteerBrowser: PuppeteerBrowser){
    this.name = name;
    this.type = type;
    this.puppeteerBrowser = puppeteerBrowser;
    this.pages = [];
    this.initialize();
  }

  private async initialize(){
    this.puppeteerBrowserContext = await this.puppeteerBrowser.defaultBrowserContext();
  }

  public async newPage(name: string, url: string): Promise<Page> {
    const page: Page = new Page(name, url, this.puppeteerBrowserContext);
    this.pages.push(page);
    return page;
  }

  public async close(){
    this.puppeteerBrowserContext.close();
  }

}