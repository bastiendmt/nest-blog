import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Article } from './articles.schema';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @ApiOperation({ description: 'Get all articles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all articles' })
  @Get()
  findAll() {
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
    return this.articlesService.create({
      content: createArticleDto.content,
      title: createArticleDto.title,
      author: createArticleDto.author,
      tags: createArticleDto.tags,
    });
  }
}
