import { IsInt, IsPositive, Max } from 'class-validator';

export class CreateBatchLinksDto {
  @IsInt()
  @IsPositive()
  @Max(100000)
  count: number;
}
