import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, throwError } from 'rxjs';
import { AuthorsService } from '../authors/authors.service';
import { Article } from './articles.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { FilterArticleDto } from './dto/filter-article.dto';

const DEFAULT_FILTER_LIMIT = 10;

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private authorService: AuthorsService,
    @Inject('BLOG_SERVICE') private rabbitClient: ClientProxy,
  ) {}

  async filter(filters: FilterArticleDto) {
    this.logger.log(`Filtering articles`);

    const query: any = {};

    if (filters.author) {
      query.author = filters.author;
    }

    if (filters.tags) {
      const tagsArray = filters.tags.split(',');
      if (tagsArray.length > 0) {
        query.tags = { $all: tagsArray };
      }
    }

    const limit = Number(filters.limit) || DEFAULT_FILTER_LIMIT;

    const articles = await this.articleModel
      .find(query)
      .sort({ createdAt: -1 })
      .exec();

    this.logger.debug(`Total results ${articles.length}`);

    /** Cursor if provided, 0 otherwise */
    const startIndex = filters.cursor
      ? articles.findIndex((a) => a.id === filters.cursor)
      : 0;

    /** Equal to startIndex + limit */
    const endIndex =
      startIndex + limit > articles.length
        ? articles.length
        : startIndex + limit;

    this.logger.debug(
      `Getting articles from index ${startIndex} to ${endIndex}`,
    );

    const nextCursor = articles[endIndex]?.id || null;
    const hasNextPage = Boolean(nextCursor);
    const slicedArticles = articles.slice(startIndex, endIndex);

    return {
      nextCursor: nextCursor,
      hasNextPage,
      articles: slicedArticles,
    };
  }

  async create({
    title,
    content,
    author,
    tags,
  }: {
    title: string;
    content: string;
    author: string;
    tags?: string[];
  }): Promise<Article> {
    this.logger.log(`Creating article`);

    const authorFound = await this.authorService.findById(author);

    if (!authorFound) {
      throw new UnprocessableEntityException(`Author not found`);
    }

    const article = await this.articleModel.create({
      title,
      content,
      author: authorFound,
      tags,
    });

    this.logger.log(`Article created with id ${article.id}`);

    this.logger.log(`Sending article to articles_queue`);
    this.rabbitClient
      .send('ARTICLE_CREATED', article)
      .pipe(
        catchError((error: any) => {
          this.logger.error(
            `Error sending message to RabbitMQ: ${error.message}`,
          );
          return throwError(() => new Error(error));
        }),
      )
      .subscribe();

    return article;
  }

  async findById(id: string) {
    this.logger.log(`Finding article with id ${id}`);
    return this.articleModel.findById(id);
  }

  async update(id: string, updateArticleDto: Partial<CreateArticleDto>) {
    this.logger.log(`Updating article with id ${id}`);

    const updatedArticle = await this.articleModel.findByIdAndUpdate(
      id,
      { $set: updateArticleDto },
      { new: true, runValidators: true },
    );

    if (!updatedArticle) {
      throw new NotFoundException(`Article not found`);
    }

    return updatedArticle;
  }

  async delete(id: string) {
    this.logger.log(`Deleting article with id ${id}`);
    const article = await this.articleModel.findById(id);

    if (!article) {
      throw new NotFoundException(`Article not found`);
    }

    return article.deleteOne();
  }

  async getArticlesWithAuthors() {
    this.logger.log(`Getting articles with authors`);
    // return this.articleModel.find().populate('author').exec();
    const articles = await this.articleModel
      .aggregate([
        {
          $lookup: {
            from: 'authors',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
          },
        },
      ])
      .exec();
    return articles;
  }
}
