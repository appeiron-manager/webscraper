import { IsDefined, IsNotEmpty, IsUrl } from 'class-validator';

export class BusinessesPageDto {
  @IsUrl()
  @IsNotEmpty()
  @IsDefined()
  businessPageUrl: string;
}