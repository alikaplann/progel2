import { IsOptional,IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateGroupDto {
    @ApiProperty({ example: 'Kaplanlar' })
    @IsString()
    name: string;
    
    @ApiProperty({ example: 'Aile Grubu' })
    @IsOptional()
    @IsString()
    description?: string;
    username: string;
    userId: number;
    }