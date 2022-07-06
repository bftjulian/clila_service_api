import { IsNotEmpty, Max, MaxLength } from 'class-validator';

export class CreateShortLinkListsDto {
  @IsNotEmpty()
  @MaxLength(100000, {
    each: true,
  })
  links: string[];
}
