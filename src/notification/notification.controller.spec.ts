import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';


describe('NotificationController', () => {
  let controller: NotificationController;
  let service: Partial<NotificationService>;
  const mockNotification = {
    id: 1,
    title: 'Notification Title',
    message: 'Gruba eklendi.',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    userId: 1,
    type: ['info', 'error', 'warning']
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
