import { IsOptional,IsEnum, IsString, IsEmail, IsInt, IsStrongPassword } from "class-validator";  
import { ApiProperty } from "@nestjs/swagger";
 

export class CreatedNotificationDto {   
    @ApiProperty({ example: 'Notification Title' })
    @IsString()
    title: string;
    
    @ApiProperty({ example: 'Gruba eklendi.' })
    @IsString()
    message: string;
    
    @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
    @IsOptional()
    @IsString()
    createdAt?: string;
 
    @ApiProperty({ example: '1' })
    @IsInt()
    userId: number;

    @ApiProperty({ example: 'info', enum: ['info', 'warning', 'erRor'] })
    @IsEnum(['info', 'warning', 'error'])
    type: 'info' | 'warning' | 'error';
    }