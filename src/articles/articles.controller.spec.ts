import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './articles.schema';

const mockArticlesService = {
  findAll: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockArticle1: Article = {
  title: 'Article 1',
  content: 'Content 1',
  author: 'Author 1',
  tags: ['tag1', 'tag2'],
};

const mockArticle2: Article = {
  title: 'Article 2',
  content: 'Content 2',
  author: 'Author 2',
  tags: ['tag3', 'tag4'],
};

export const mockArticles: Article[] = [mockArticle1, mockArticle2];

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        {
          provide: ArticlesService,
          useValue: mockArticlesService,
        },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all articles', async () => {
    mockArticlesService.findAll.mockResolvedValueOnce(mockArticles);

    const articles = await controller.findAll();
    expect(articles.length).toBe(2);
  });

  it('should create an article', async () => {
    mockArticlesService.create.mockResolvedValueOnce(mockArticle1);

    const article = await controller.create({
      title: mockArticle1.title,
      content: mockArticle1.content,
      author: mockArticle1.author,
      tags: mockArticle1.tags,
    });

    expect(article).toEqual(mockArticle1);
  });

  it('should return a single article', async () => {
    mockArticlesService.findById.mockResolvedValueOnce(mockArticle1);

    const article = await controller.findById('some-id');
    expect(article).toEqual(mockArticle1);
  });

  it('should update an article', async () => {
    mockArticlesService.update.mockResolvedValueOnce(mockArticle1);

    await controller.update('some-id', mockArticle1);
    expect(mockArticlesService.update).toHaveBeenCalled();
  });

  it('should delete an article', async () => {
    mockArticlesService.delete.mockResolvedValueOnce(mockArticle1);

    await controller.delete('some-id');
    expect(mockArticlesService.delete).toHaveBeenCalled();
  });
});
