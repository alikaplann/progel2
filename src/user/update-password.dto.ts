import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Eski şifre en az 8 karakter olmalı' })
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'Yeni şifre en az 8 karakter olmalı' })
  newPassword: string;
}