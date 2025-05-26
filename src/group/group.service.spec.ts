import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { PrismaService } from '../prisma/prisma.service';
import { Group } from '@prisma/client';

describe('GroupService', () => {
  let service: GroupService;
  let prisma: Partial<Record<keyof PrismaService, any>>;

  const mockGroup: Group = {
    id: 1,
    username: 'Test Group',
    descriptions: 'A test group',
    userId: 1,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    prisma = {
      group: {
        findUnique: jest.fn().mockResolvedValue(mockGroup),
        update: jest.fn().mockResolvedValue(mockGroup),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a group by id', async () => {
      const result = await service.findOne(1);
      expect(prisma.group.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockGroup);
    });
  });

  describe('update', () => {
    it('should update and return the group', async () => {
      const dto = { username: 'Updated Group', descriptions: 'Updated Desc' };
      const result = await service.updateGroup(1, dto);
      expect(prisma.group.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
      expect(result).toEqual(mockGroup);
    });
  });
});
