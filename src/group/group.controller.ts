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
import { GroupService } from './group.service';
import { CreateGroupDto } from './create-group.dto';
import { UpdateGroupDto } from './update-group.dto';
import { PaginationDto } from '../paging/pagination.dto';
import { FilteringDto } from '../filtering/filtering.dto';
import type { Group } from '@prisma/client';
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

}
