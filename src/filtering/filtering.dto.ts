import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsInt, IsEnum, IsPositive, Min, IsString } from "class-validator";
import {Role} from "@prisma/client";

export class FilteringDto {
  @ApiPropertyOptional({ enum: Role, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: 'aliKaplan' })
  @IsOptional()
  @IsString()
  username?: string;
@ApiPropertyOptional({ example: 'ali123@kobil.com'})
  @IsOptional() 
  @IsString()
  email?: string;

}