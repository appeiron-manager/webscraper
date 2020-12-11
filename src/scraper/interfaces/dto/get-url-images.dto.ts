import { ArrayMaxSize, IsArray, IsDefined } from 'class-validator';

export class GetUrlImagesDto {
  @IsArray()
  @IsDefined()
  @ArrayMaxSize(100)
  urlImages: string[];
}
