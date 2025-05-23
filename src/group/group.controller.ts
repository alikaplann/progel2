import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './create-group.dto';
import { UpdateGroupDto } from './update-group.dto';
import { PaginationDto } from '../helpers/pagination.dto';
import { FilteringDto } from '../helpers/filtering.dto';
import type { Group, User } from '@prisma/client'
import { ApiOperation, ApiParam, ApiTags }     from '@nestjs/swagger';
@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
 @Post('create')
 create(@Body() dto: CreateGroupDto): Promise<Group> {
   return this.groupService.createGroup(dto);
 }
@Get('list')
async findAll(
  @Query() pagination: PaginationDto,
  @Query() filter: FilteringDto,
): Promise<Group[]> {
  const { items } = await this.groupService.findAll({ pagination, filter });
  return items;
}
@Get(':id')
findOne(@Param('id') id: string): Promise<Group | null> {
  return this.groupService.findOne(+id);}
@Patch('update/:id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateGroupDto,
): Promise<Group> {
  return this.groupService.updateGroup(+id, dto); }
  @Delete('delete/:id')
  remove(@Param('id') id: string): Promise<Group> {
    return this.groupService.deleteGroup(+id);
  }
@ApiOperation({ summary: 'Belirli bir grubun üyelerini listele (sayfalı & filtreli)' })
  @ApiParam({ name: 'id', description: 'Grup ID’si', example: 3 })
  @Get(':id/members')
  async getGroupMembers(
    @Param('id', ParseIntPipe) id: number,
    @Query() pagination: PaginationDto,
    @Query() filter: FilteringDto,
  ): Promise<{
    items: User[];
    meta: {
      totalItems: number;
      itemCount: number;
      perPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { items, meta } = await this.groupService.findMembers(id, {
      pagination,
      filter,
    });
    return { items, meta };
  }
}