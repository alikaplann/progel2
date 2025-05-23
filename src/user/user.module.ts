import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
// import { Prisma } from 'generated/prisma';
// If you need PrismaModule, import it from the correct path:
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
