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
  BadRequestException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './create-group.dto';
import { UpdateGroupDto } from './update-group.dto';
import { PaginationDto } from '../helpers/pagination.dto';
import { FilteringDto } from '../helpers/filtering.dto';
import type { Group, User } from '@prisma/client'
import { ApiOperation, ApiBadRequestResponse,ApiParam, ApiTags }     from '@nestjs/swagger';
@ApiTags('groups')
@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
 @ApiOperation({ summary: 'Grup oluşturma' })
  @ApiBadRequestResponse({ description: 'Bad Request',schema: {
      example: {
        statusCode: 400,
        message: [
          'username must be longer than or equal to 3 characters',
          'email must be an email'
        ],
        error: 'Bad Request'
      }
    } })
  
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
@ApiOperation({ summary: 'Grup listeleme' })
@ApiBadRequestResponse({ description: 'Bad Request',schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request'
      }
    }
  })
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
@ApiOperation({ summary: 'Belirli bir grubun üyelerini listeleme' })
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