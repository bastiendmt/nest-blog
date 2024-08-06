import { Controller, Logger, Post, Body, Param, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  private readonly logger = new Logger(AuthorsController.name);

  constructor(private authorsService: AuthorsService) {}

  @ApiOperation({ description: 'Create a new author' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created author',
  })
  @ApiResponse({
    status: 409,
    description: 'Author already exists',
  })
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    this.logger.log(`Creating author`);
    return this.authorsService.create(createAuthorDto);
  }

  @ApiOperation({ description: 'Find an author by email' })
  @ApiResponse({
    status: 200,
    description: 'Returns the found author',
  })
  @Get('find/:email')
  findByEmail(@Param('email') email: string) {
    this.logger.log(`Finding author by email ${email}`);
    return this.authorsService.findByEmail(email);
  }
}
