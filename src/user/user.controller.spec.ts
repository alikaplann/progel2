import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, Role } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let service: Partial<UserService>;

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

  const userServiceMock = {
    findAll: jest.fn().mockResolvedValue({ items: [mockUser], total: 1 }),
    findOne: jest.fn().mockResolvedValue(mockUser),
    createUser: jest.fn().mockResolvedValue(mockUser),
     updateUser: jest.fn().mockResolvedValue(mockUser),
     removeUser: jest.fn().mockResolvedValue(mockUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const pagination = { page: 1, perPage: 10 };
      const filter = {};
      const result = await controller.findAll(pagination, filter);

      expect(userServiceMock.findAll).toHaveBeenCalledWith({ pagination, filter });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne('1');
      expect(userServiceMock.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const dto = { username: 'testuser', email: 'test@example.com', password: 'hashedpassword', age: 30, role: Role.USER };
      const result = await controller.create(dto);
      expect(userServiceMock.createUser).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const dto = { username: 'updated', email: 'updated@example.com' };
      const result = await controller.update('1', dto);
      expect(userServiceMock.updateUser).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('remove', () => {
    it('should delete and return user', async () => {
      const result = await controller.remove('1');
      expect(userServiceMock.removeUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });
});

