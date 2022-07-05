import { IsNotEmpty } from 'class-validator';

export class CreateShortLinkListsDto {
  @IsNotEmpty()
  links: string[];
}
