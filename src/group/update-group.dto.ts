import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateGroupDto {
    @ApiProperty({ example: 'Kaplanlar' })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ example: 'Aile Grubu' })
    @IsOptional()
    @IsString()
    description?: string;
}