import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ example: 'aliKaplan' })
  @IsOptional()
  @IsString()
  username?: string;

@ApiProperty({ example: 'ali123' })
  @IsOptional()
  @IsString()
  password?: string;
  
@ApiProperty({ example: Role.USER, required: false, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;


}

