import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma} from '@prisma/client';
import type { Group, Group as GroupType } from '@prisma/client';
import { PaginationDto } from '../helpers/pagination.dto';
import { FilteringDto } from '../helpers/filtering.dto';
import { CreateGroupDto } from './create-group.dto';  
import { PaginatedResult } from 'src/helpers/paginated.results';
import { NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';

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
async listAllMembers(id: number): Promise<GroupType | null> {
  return this.prisma.group.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
    },
  });
}

async findMembers(
    groupId: number,
    opts: {
      pagination: PaginationDto;
      filter:     FilteringDto;
    },
  ): Promise<PaginatedResult<User>> {
    // Grup var mı kontrolü
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException(`Group with id ${groupId} not found`);
    }

    // Pagination ayarları
    const { page = 1, perPage = 10 } = opts.pagination;
    const skip = (page - 1) * perPage;
    const take = perPage;

    // Dinamik filtreler (username, email, role)
    const userWhere: Record<string, any> = {};
    if (opts.filter.username) {
      userWhere.username = { contains: opts.filter.username, mode: 'insensitive' };
    }
    if (opts.filter.email) {
      userWhere.email = { contains: opts.filter.email, mode: 'insensitive' };
    }
    if (opts.filter.role) {
      userWhere.role = opts.filter.role;
    }

    //  Toplam kayıt sayısını al
    const totalItems = await this.prisma.groupMember.count({
      where: { groupId, user: userWhere },
    });

    //  Üyeleri çek, include ile user bilgisini al
    const members = await this.prisma.groupMember.findMany({
      where: { groupId, user: userWhere },
      skip,
      take,
      orderBy: { joinedAt: 'desc' },
      include: { user: true },
    });

    //  Sadece user objelerini al
    const items = members.map(m => m.user);

    //  Meta bilgisini hazırla
    const totalPages = Math.ceil(totalItems / perPage);
    const meta = {
      totalItems,
      itemCount:   items.length,
      perPage,
      totalPages,
      currentPage: page,
    };

    return { items, meta };
  }
}