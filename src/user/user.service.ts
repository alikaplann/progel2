import { Injectable,Inject, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma, User } from '@prisma/client';
import { PaginationDto } from '../helpers/pagination.dto';
import { FilteringDto } from '../helpers/filtering.dto';
import { PaginatedResult } from 'src/helpers/paginated.results';
import type { GroupMember } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';
import { Group } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache;
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    await this.cacheManager.del('users_list'); 
    return this.prisma.user.create({ data });
  }

  async findAll(opts: {
    pagination: PaginationDto;
    filter: FilteringDto;
  }): Promise<PaginatedResult<User>> {
    const { page = 1, perPage = 10 } = opts.pagination;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: Prisma.UserWhereInput = {};
    if (opts.filter.username) {
      where.username = { contains: opts.filter.username, mode: 'insensitive' };
    }
    if (opts.filter.email) {
      where.email = { contains: opts.filter.email, mode: 'insensitive' };
    }
    if (opts.filter.role) {
      where.role = opts.filter.role;
    }

    const totalItems = await this.prisma.user.count({ where });
    const items = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'asc' },
    });
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        perPage,
        totalPages,
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    await this.cacheManager.del('users_list'); 
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async removeUser(id: number): Promise<User> {
    await this.cacheManager.del('users_list'); 
    await this.cacheManager.del(`user_${id}`);
    return this.prisma.user.delete({ where: { id } });
  }
   async joinGroup(
    userId: number,
    groupId: number,
  ): Promise<GroupMember> {
    const [user, group] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.group.findUnique({ where: { id: groupId } }),
    ]);
    if (!user)  throw new NotFoundException(`User ${userId} bulunamadi`);
    if (!group) throw new NotFoundException(`Group ${groupId} bulunamadi`);

    return this.prisma.groupMember.create({
      data: {
        userId,
        groupId,
      },
    });
}
async updatePassword(
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<Omit<User, 'password'>> {

  const user = await this.prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,  

    },
  });

  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }

  if (!oldPassword) {
    throw new BadRequestException('Eski şifre boş olamaz');
  }


  
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new BadRequestException('Eski şifre yanlış');
  }


  const sameAsOld = await bcrypt.compare(newPassword, user.password);
  if (sameAsOld) {
    throw new BadRequestException('Yeni şifre, eski şifre ile aynı olamaz');
  }


  const hashedNew = await bcrypt.hash(newPassword, 10);
  const updatedUser = await this.prisma.user.update({
    where: { email },
    data: { password: hashedNew },
    select: {
      id: true,
      username: true,
      email: true,
      age: true,
      role: true,
      createdAt: true,
      updatedAt: true,

    },
  });

  return updatedUser;
}
}