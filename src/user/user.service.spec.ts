import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';

describe('UserService', () => {
  let service: UserService;
  let prisma: Partial<PrismaService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    age: 30,
    role: Role.USER,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        count:     jest.fn().mockResolvedValue(42),
        findMany: jest.fn().mockResolvedValue([mockUser]),
        findUnique: jest.fn().mockResolvedValue(mockUser),
        create: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockResolvedValue(mockUser),
        delete: jest.fn().mockResolvedValue(mockUser),
      } as any,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of users', async () => {
      const pagination = { page: 1, perPage: 10 };
      const filter = {};
      const result = await service.findAll({ pagination, filter });

      expect((prisma.user!.findMany as jest.Mock)).toHaveBeenCalledWith({
        skip: (pagination.page - 1) * pagination.perPage,
        take: pagination.perPage,
        where: filter,
        orderBy: { id: 'asc' },    

      });

      expect(result.items).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      const result = await service.findOne(1);
      expect(prisma.user!.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const dto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        age: 30,
        role: Role.USER,
      };
      const result = await service.createUser(dto);
      expect(prisma.user!.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const dto = { username: 'updated', email: 'updated@example.com' };
      const result = await service.updateUser(1, dto);
      expect(prisma.user!.update).toHaveBeenCalledWith({ where: { id: 1 }, data: dto });
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete and return the user', async () => {
      const result = await service.removeUser(1);
      expect(prisma.user!.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });
});
