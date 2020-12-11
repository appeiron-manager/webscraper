import { ImagesSourceDto } from 'src/scraper/interfaces/dto/images-source.dto';
export declare class ScraperController {
    mainScrape(): Promise<void>;
    getImages(imagesSourceDto: ImagesSourceDto): Promise<void>;
}
