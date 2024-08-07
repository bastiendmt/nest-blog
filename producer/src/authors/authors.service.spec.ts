import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Author } from './authors.schema';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';

const mockAuthorModel = {
  create: jest.fn(),
  findOne: jest.fn(),
};

export const mockAuthor1: Author = {
  name: 'John Doe',
  email: 'john@example.com',
};

describe('AuthorsService', () => {
  let service: AuthorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        { provide: getModelToken(Author.name), useValue: mockAuthorModel },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createAuthorDto: CreateAuthorDto = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    it('should not create an author if it already exists', async () => {
      mockAuthorModel.findOne.mockResolvedValue(mockAuthor1);

      try {
        await service.create(createAuthorDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.CONFLICT);
        expect(error.message).toBe('Author already exists');
      }
    });

    it('should create an author', async () => {
      mockAuthorModel.findOne.mockResolvedValue(null);
      mockAuthorModel.create.mockResolvedValueOnce(mockAuthor1);
      const author = await service.create(createAuthorDto);
      expect(mockAuthorModel.create).toHaveBeenCalled();
      expect(author).toBeDefined();
    });
  });

  it('should find an author by email', async () => {
    mockAuthorModel.findOne.mockResolvedValueOnce(mockAuthor1);
    const author = await service.findByEmail('john@example.com');
    expect(author).toBeDefined();
    expect(mockAuthorModel.findOne).toHaveBeenCalled();
  });
});
