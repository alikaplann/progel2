// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';



export interface SignupDto {
  username: string;
  email: string;
  password: string;
  age?: number;
  role?: 'ADMIN' | 'USER';
}

export interface SigninDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}


  async signup(dto: SignupDto): Promise<{ token: string }> {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { ...dto, password: hash },
    });
    const token = this.signToken(user);
    return { token };
  }

async signin(dto: SigninDto): Promise<{ access_token: string }> {
  // Find the user by email
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Check if the password matches
  const passwordMatches = await bcrypt.compare(dto.password, user.password);
  if (!passwordMatches) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Sign and return the JWT token
  const access_token = this.signToken(user);

  // Log the token
  console.log('▶️ New access token:', access_token);

  return { access_token };
}

  private signToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      age: user.age,
      role: user.role,
    };
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }
}
