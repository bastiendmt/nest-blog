import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Article } from './articles.schema';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

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
  @ApiBody({ type: CreateArticleDto })
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

  @ApiOperation({ description: 'Update an article by id' })
  @ApiBody({ type: PartialType<CreateArticleDto> })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the updated article',
    type: Article,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: Partial<CreateArticleDto>,
  ) {
    this.logger.log(`Updating article with id ${id}`);
    return this.articlesService.update(id, updateArticleDto);
  }

  @ApiOperation({ description: 'Delete an article by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Article deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    this.logger.log(`Deleting article with id ${id}`);
    return this.articlesService.delete(id);
  }
}
