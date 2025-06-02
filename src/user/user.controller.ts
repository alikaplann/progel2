// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { PaginationDto } from '../helpers/pagination.dto';
import { FilteringDto } from '../helpers/filtering.dto';
import { CacheInterceptor,CacheKey,CacheTTL } from '@nestjs/cache-manager';
import type { User } from '@prisma/client';

import { ApiOperation, ApiParam, ApiTags }     from '@nestjs/swagger';
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Get('list')
  @CacheKey('users_list')
  @CacheTTL(10)  
async findAll(
  @Query() pagination: PaginationDto,
  @Query() filter: FilteringDto,
): Promise<User[]> {
  const { items } = await this.userService.findAll({ pagination, filter });
  return items;
}

  @Get(':id')
  @CacheKey('user_by_id')
  @CacheTTL(10)
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(+id);
  }

  @Patch('update/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(+id, dto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.removeUser(+id);
  }

  @ApiOperation({ summary: 'Bir kullaniciyi gruba ekle' })
  @ApiParam({ name: 'id'    })
  @ApiParam({ name: 'groupId' })
  @Post(':id/groups/:groupId')
  joinGroup(
    @Param('id', ParseIntPipe)      userId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.userService.joinGroup(userId, groupId);
  }
}



