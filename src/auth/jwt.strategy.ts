// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../prisma/prisma.service';
import type { User } from '@prisma/client';
export interface JwtPayload {
  sub: number;
  email: string;
  username: string;
  age?: number;
  role: 'ADMIN' | 'USER';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'S3CRET',
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
    username: string;
    age?: number;
    role: string;
  }): Promise<Omit<User, 'password'>> {

    const { sub: id } = payload;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, ...rest } = user;
    return rest;
  }
}
