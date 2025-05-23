import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, SigninDto, SignupDto } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}

@Post('signup')
async signup(@Body() dto: SignupDto) {
  return this.authService.signup(dto);
}
@Post('signin')
async signin(@Body() dto: SigninDto) {
  return this.authService.signin(dto);}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

}
