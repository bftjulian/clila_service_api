import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';

export class IFilterDateValue {
  @IsDateString()
  @Type(() => Date)
  @ApiProperty({ type: Date })
  start_date: Date;

  @IsDateString()
  @Type(() => Date)
  @ApiProperty({ type: Date })
  end_date: Date;
}

class FilterParams {
  @IsString()
  @ApiProperty()
  type: 'string' | 'date';

  @IsString()
  @ApiProperty()
  column: string;

  @IsString()
  @ApiProperty()
  // @ValidateNested()
  // @Type(() => IFilterDateValue)
  value: IFilterDateValue | string;
}

export class IOrder {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  order: 'ASC' | 'DESC';
}

export class QueryDto {
  @ApiProperty({
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    default: 10,
    required: false,
  })
  @Max(1000)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    required: false,
  })
  // @ValidateNested({ each: true })
  @Type(() => FilterParams)
  filter?: FilterParams[] = [];

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    required: false,
  })
  @IsArray()
  // @ValidateNested({ each: true })
  @Type(() => IOrder)
  order?: IOrder[] = [];
}
