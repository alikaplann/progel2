import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: Partial<PrismaService>;
  const mockNotification = {
    id: 1,
    title: 'Notification Title',
    message: 'Gruba eklendi.',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    userId: 1,
    type: ['info', 'error', 'warning']
  };
  beforeEach(async () => {
    prisma = {}; // Initialize mock prisma object
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
