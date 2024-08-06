import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockArticle1, mockArticles } from './articles.controller.spec';
import { Article } from './articles.schema';
import { ArticlesService } from './articles.service';
import { AuthorsService } from '../authors/authors.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { mockAuthor1 } from '../authors/authors.service.spec';

class MockArticleModel {
  constructor(dto: any) {
    Object.assign(this, dto);
  }

  save = jest.fn().mockImplementation(() => Promise.resolve(this));
}

const mockArticleModel = Object.assign(MockArticleModel, {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  update: jest.fn(),
  deleteOne: jest.fn(),
  sort: jest.fn(),
  exec: jest.fn(),
});

const mockAuthorService = {
  findById: jest.fn(),
};

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getModelToken(Article.name),
          useValue: mockArticleModel,
        },
        {
          provide: AuthorsService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('filter', () => {
    it('should filter articles', async () => {
      mockArticleModel.find.mockReturnThis();
      mockArticleModel.sort.mockReturnThis();
      mockArticleModel.exec.mockResolvedValueOnce(mockArticles);
      const results = await service.filter({});
      expect(results.articles.length).toEqual(2);
    });

    it('should limit results and send next cursor', async () => {
      mockArticleModel.find.mockReturnThis();
      mockArticleModel.sort.mockReturnThis();
      mockArticleModel.exec.mockResolvedValueOnce(mockArticles);
      const results = await service.filter({ limit: 1 });
      expect(results.articles.length).toEqual(1);
    });
  });

  describe('create', () => {
    const createArticleDto: CreateArticleDto = {
      title: 'Some title',
      content: 'Some content',
      author: '66b23317c27cad262421db00',
      tags: ['news'],
    };
    it('should fail if author not found', async () => {
      mockAuthorService.findById.mockResolvedValueOnce(null);
      try {
        await service.create(createArticleDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(error.message).toBe('Author not found');
      }
    });

    it('should create an article', async () => {
      mockAuthorService.findById.mockResolvedValueOnce(mockAuthor1);
      mockArticleModel.create.mockResolvedValueOnce(mockArticle1);
      const article = await service.create(createArticleDto);
      expect(article).toBeDefined();
    });
  });

  it('should find a single article', async () => {
    mockArticleModel.findById.mockResolvedValueOnce(mockArticle1);
    const article = await service.findById('some-id');
    expect(article).toEqual(mockArticle1);
  });

  describe('update', () => {
    it('should fail if article not found', async () => {
      mockArticleModel.findByIdAndUpdate.mockResolvedValueOnce(null);
      try {
        await service.update('some-id', {});
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Article not found');
      }
    });

    it('should update an article', async () => {
      mockArticleModel.findByIdAndUpdate.mockResolvedValueOnce(mockArticle1);
      const response = await service.update('some-id', {
        title: 'New title',
      });
      expect(mockArticleModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should fail if article not found', async () => {
      mockArticleModel.findById.mockResolvedValueOnce(null);
      try {
        await service.delete('some-id');
        expect(true).toBe(false);
      } catch (error) {
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('Article not found');
      }
    });

    it('should delete an article', async () => {
      const mockDeleteOne = jest.fn();
      mockArticleModel.findById.mockResolvedValueOnce({
        ...mockArticle1,
        deleteOne: mockDeleteOne,
      });
      mockArticleModel.deleteOne.mockResolvedValueOnce(null);
      await service.delete('some-id');
      expect(mockArticleModel.findById).toHaveBeenCalled();
      expect(mockDeleteOne).toHaveBeenCalled();
    });
  });
});
