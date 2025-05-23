import { ApiPropertyOptional } from "@nestjs/swagger";
import {Type } from "class-transformer";
import { IsOptional, IsInt, IsPositive,Min } from "class-validator";
export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  perPage?: number = 10;
}