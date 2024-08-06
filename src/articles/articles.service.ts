import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './articles.schema';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async findAll() {
    this.logger.log(`Finding all articles`);
    return this.articleModel.find();
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
    const article = new this.articleModel({ title, content, author, tags });
    return article.save();
  }

  async findById(id: string) {
    this.logger.log(`Finding article with id ${id}`);
    return this.articleModel.findById(id);
  }

  async update(id: string, updateArticleDto: Partial<Article>) {
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
}
