import { IsDefined, IsNotEmpty, IsUrl } from 'class-validator';

export class ImagesSourceDto {
  @IsUrl()
  @IsNotEmpty()
  @IsDefined()
  urlSource: string;
}
