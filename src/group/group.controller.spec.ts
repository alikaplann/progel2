import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Group } from '@prisma/client';

describe('GroupController', () => {
  let controller: GroupController;
  let service: Partial<GroupService>;

  const mockGroup: Group = {
    id: 1,
    username: 'Test Group',
    descriptions: 'A test group',
    userId: 1,
    createdAt: new Date('2025-05-26T12:40:24.836Z'),
    updatedAt: new Date('2025-05-26T12:40:24.836Z'),
  };

  const mockPagination = { page: 1, perPage: 10 };
  const mockFilter = {};

  const groupServiceMock = {
      findAll:      jest.fn().mockResolvedValue({
                  items: [mockGroup],
                  total:  1,
                }),
    findOne: jest.fn().mockResolvedValue(mockGroup),
    createGroup: jest.fn().mockResolvedValue(mockGroup),
    updateGroup: jest.fn().mockResolvedValue(mockGroup),
    deleteGroup: jest.fn().mockResolvedValue(mockGroup),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        { provide: GroupService, useValue: groupServiceMock },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const result = await controller.findAll(mockPagination, mockFilter)
      expect(groupServiceMock.findAll).toHaveBeenCalledWith({ pagination: mockPagination, filter: mockFilter });
      expect(result).toEqual([mockGroup]);
    });
  });

  describe('findOne', () => {
    it('should return a single group by id', async () => {
      const result = await controller.findOne('1');
      expect(groupServiceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('create', () => {
    it('should create and return a group', async () => {
      const dto = { username: 'Test Group', descriptions: 'A test group', userId: 1 };
      const result = await controller.create(dto);
      expect(groupServiceMock.createGroup).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('update', () => {
    it('should update and return the group', async () => {
      const dto = { username: 'Updated', descriptions: 'Updated group' };
      const result = await controller.update('1', dto);
      expect(groupServiceMock.updateGroup).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockGroup);
    });
  });

  describe('remove', () => {
    it('should remove and return the deleted group', async () => {
      const result = await controller.remove('1');
      expect(groupServiceMock.deleteGroup).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGroup);
    });
  });
});
