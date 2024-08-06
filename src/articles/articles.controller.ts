import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from './articles.schema';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);

  constructor(private articlesService: ArticlesService) {}

  @ApiOperation({ description: 'Get all articles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all articles' })
  @Get()
  findAll() {
    this.logger.log(`Finding all articles`);
    return this.articlesService.findAll();
  }

  @ApiOperation({ description: 'Create a new article' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Returns the created article',
    type: Article,
  })
  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    this.logger.log(`Creating article`);
    return this.articlesService.create({
      content: createArticleDto.content,
      title: createArticleDto.title,
      author: createArticleDto.author,
      tags: createArticleDto.tags,
    });
  }

  @ApiOperation({ description: 'Get an article by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a single article',
    type: Article,
  })
  @Get(':id')
  findById(@Param('id') id: string) {
    this.logger.log(`Finding article with id ${id}`);
    return this.articlesService.findById(id);
  }
}
