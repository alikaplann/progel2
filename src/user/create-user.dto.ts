import { IsOptional, IsEnum, IsString, IsEmail, IsInt } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'aliKaplan' })
  @IsString()
  username: string;
  @ApiProperty({ example: 'ali123' })
  @IsString()
  password: string;
  @ApiProperty({ example: 'ali123@kobil.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '25'})
  @IsOptional()
  @IsInt()
  age?: number;
  
  @ApiProperty({ example: Role.USER, required: false, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}