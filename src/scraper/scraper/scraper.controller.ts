import { Controller, Get } from '@nestjs/common';
import { ImagesSourceDto } from 'src/scraper/interfaces/dto/images-source.dto';
//import * as puppeteer from 'puppeteer';
//import { Browser, Page, BrowserContext } from 'puppeteer';
import { Browser } from './models/Browser';
import { BrowserContext } from './models/BrowserContext';
import { Page } from './models/Page';

@Controller('scraper')
export class ScraperController {

  @Get('/main-scrape')
  async mainScrape(): Promise<void> {
    const mainAppPageUrl = 'https://www.pedidosya.com.pa/';
    // const cities = getCities(zone).filter((city) => city.available);
    // For city in cities
    const browser: Browser = new Browser('main');
    await browser.launch();
    const context: BrowserContext = await browser.newContext('main', 'default');
    const page: Page = await context.newPage('main', mainAppPageUrl);
    await page.initialize();
    
    await page.requestInterception(true);
    await page.interceptRequestsOn('image');
    // page.on('request', (request) => {
    //     if (request.resourceType() !== 'image') {
    //         request.continue();
    //     } else {
    //         request.abort();
    //     }
    // });

    await page.loadPage();
    //await page.click('#selectArea_chosen');
    await page.click('#selectArea_chosen');

    await page.waitForTimeout(500);

    //cityIndex = city.selectorIndex;
    // For (i=0;i < cityIndex; i++)
    await page.pressKeyboard('ArrowDown');
    // End For

    await page.pressKeyboard('Enter');
    
    const searchMap = await page.searchElement('#searchMap');
    
    await Promise.all([
      page.click('#search'),
      page.waitForTimeout(500)
    ]);

    await page.clickOnElement(searchMap);

    //go to new page
    await page.waitForTimeout(500);

    await page.waitForSelectorLoaded('#confirm', true);

    await Promise.all([
      page.waitForNavigation(),
      page.click('#confirm')
    ]);

    // const pageList = await browser.pages();
    // pageList.forEach(pagee => { console.log(pagee.url()) });
    
    //Get list of restaurants urls
    const businessLinks: Array<string> = [];
    try{
      let hasMorePages = true;
      while(hasMorePages){
        const items = await page.searchAllElements('a.arrivalName');
        items.forEach(async (item) => {
          const href = await item.evaluate( node => {return node.getAttribute('href')});
          businessLinks.push(href);
        })

        const nextPageButton = await page.searchElement('.arrow.next');
        if(!nextPageButton){
          hasMorePages = false
        }else{
          await Promise.all([
            nextPageButton.click(),
            page.waitForNavigation()
          ]);
        }
      }
    } catch(e){
      console.log(e)
    }

    await page.screenshot("example1.png");

    //items.forEach(item => { console.info(item)});  
    console.info(businessLinks[0]);

    //Go to business page(Open new page with item href)
    //const businessPage: Page = await context.newPage();
    const businessPage: Page = await context.newPage('businessPage', businessLinks[0]);
    await businessPage.initialize();

    await Promise.all([
      businessPage.loadPage(),
      businessPage.waitForNavigation(),
      businessPage.bringToFront(),
    ])
    
    await businessPage.screenshot("example2.png");
    browser.close();

  }

  async getImages(imagesSourceDto: ImagesSourceDto): Promise<void> {
    let links: string[] = [];
    const browser: Browser = new Browser('main');
    browser.launch();
    const context: BrowserContext = await browser.newContext('main', 'default');
    const page: Page = await context.newPage('imagesPate', imagesSourceDto.urlSource);
    links = await page.getImagesUrls();
    
    await page.loadPage();
    console.log("ScraperController -> links.length", links.length)
    browser.close();
  }

}

/*
availableCities = From DB get available cites
For each availableCity do
  cityRestaurants = From DB get cityRestaurants(cityId)

  Go to main page
  select city
  select in map
  click in button to go to city's restaurants
  Going page by page
    Get list of restaurant's href
    For each hrefRestaurant do
      Go to restaurant page(Open new page with item href)
        imagesMetadata = Get links, id hashes per image request
        restaurantImages = Get restaurant images data from Database
        For each imagesMetadata do
          If imageMetada is new then
            restaurantImages.push(imagesMetadata)
          Else
            update restaurantImage data
          End
        End
      End
    End
  End
End
*/