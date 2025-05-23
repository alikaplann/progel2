import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma} from '@prisma/client';
import type { Group, Group as GroupType } from '@prisma/client';
import { PaginationDto } from '../paging/pagination.dto';
import { FilteringDto } from '../filtering/filtering.dto';
import { CreateGroupDto } from './create-group.dto';  
import { PaginatedResult } from 'src/paging/paginated.results';


@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

async createGroup(dto: CreateGroupDto): Promise<Group> {
  const { username, description, userId } = dto;
  return this.prisma.group.create({
   data: {
  username,
  descriptions: dto.description,
  user: { connect: { id: dto.userId } },
}
  });
}

async findOne(id: number): Promise<GroupType | null> {
  return this.prisma.group.findUnique({
    where: { id },
  });
}

async updateGroup(id: number, data: Prisma.GroupUpdateInput): Promise<GroupType> {
  return this.prisma.group.update({
    where: { id },
    data: data,
  });
}
async deleteGroup(id: number): Promise<GroupType> {
  return this.prisma.group.delete({
    where: { id },
  });

}
async findAll(opts: {
    pagination: PaginationDto;
    filter: FilteringDto;
  }): Promise<PaginatedResult<Group>> {
    const { page = 1, perPage = 10 } = opts.pagination;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const where: Prisma.GroupWhereInput = {};
    if (opts.filter.username) {
      where.username = { contains: opts.filter.username, mode: 'insensitive' };
    }

    const totalItems = await this.prisma.group.count({ where });
    const items = await this.prisma.group.findMany({
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

}