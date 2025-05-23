import { IsInt, IsNotEmpty, IsOptional,IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateGroupDto {
    @ApiProperty({ example: 'Kaplanlar' })
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @ApiProperty({ example: 'Aile Grubu' })
    @IsOptional()
    @IsString()
    description?: string;
    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    userId: number;
    }