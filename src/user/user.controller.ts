// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { PaginationDto } from '../paging/pagination.dto';
import { FilteringDto } from '../filtering/filtering.dto';
import type { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Get('list')
async findAll(
  @Query() pagination: PaginationDto,
  @Query() filter: FilteringDto,
): Promise<User[]> {
  const { items } = await this.userService.findAll({ pagination, filter });
  return items;
}

  @Get(':id')
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
}
