import { Browser as PuppeteerBrowser, BrowserContext as PuppeteerBrowserContext} from "puppeteer";
import { BrowserContext } from './BrowserContext';
import * as puppeteer from 'puppeteer';

export class Browser {
  puppeteerBrowser: PuppeteerBrowser;
  contexts: BrowserContext[];
  name: string;

  constructor(name: string) {
    this.name = name;
    this.contexts = [];
  }

  async launch(){
    this.puppeteerBrowser = await puppeteer.launch();
  }

  close(){
    this.puppeteerBrowser.close();
  }

  async newContext(name: string, type: string){
    const context: BrowserContext = await new BrowserContext(name, type, this.puppeteerBrowser);
    this.contexts.push(context);
    return context;
  }
}