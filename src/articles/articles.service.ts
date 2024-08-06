import { Injectable, Logger } from '@nestjs/common';
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
    const article = new this.articleModel({ title, content, author, tags });
    return article.save();
  }

  async findById(id: string) {
    return this.articleModel.findById(id);
  }
}
