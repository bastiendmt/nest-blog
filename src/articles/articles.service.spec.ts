import { HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockArticle1, mockArticles } from './articles.controller.spec';
import { Article } from './articles.schema';
import { ArticlesService } from './articles.service';

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
});

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
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all articles', async () => {
    mockArticleModel.find.mockResolvedValueOnce(mockArticles);
    const articles = await service.findAll();
    expect(articles.length).toEqual(2);
  });

  it('should create an article', async () => {
    mockArticleModel.create.mockResolvedValueOnce(mockArticle1);
    const article = await service.create({
      title: mockArticle1.title,
      content: mockArticle1.content,
      author: mockArticle1.author,
      tags: mockArticle1.tags,
    });
    expect(article).toBeDefined();
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
