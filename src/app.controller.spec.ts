import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: Partial<Record<keyof AppService, jest.Mock>>;

  const mockHello = 'Mocked Hello World!';

  beforeEach(async () => {
    // AppService mock
    appService = {
      getHello: jest.fn().mockReturnValue(mockHello),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: appService },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('getHello', () => {
    it('should return value from AppService.getHello', () => {
      const result = appController.getHello();
      expect(appService.getHello).toHaveBeenCalled();
      expect(result).toBe(mockHello);
    });
  });
});
