import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

const mockAuthorsService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

describe('AuthorsController', () => {
  let controller: AuthorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [{ provide: AuthorsService, useValue: mockAuthorsService }],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an author', async () => {
    await controller.create({
      name: 'John Doe',
      email: 'john@example.com',
    });
    expect(mockAuthorsService.create).toHaveBeenCalled();
  });

  it('should find an author by email', async () => {
    await controller.findByEmail('john@example.com');
    expect(mockAuthorsService.findByEmail).toHaveBeenCalled();
  });
});
