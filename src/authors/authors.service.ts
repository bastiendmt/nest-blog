import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author } from './authors.schema';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorsService {
  private readonly logger = new Logger(AuthorsService.name);

  constructor(@InjectModel(Author.name) private authorModel: Model<Author>) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const existingAuthor = await this.findByEmail(createAuthorDto.email);
    if (existingAuthor) {
      throw new ConflictException('Author already exists');
    }

    this.logger.log(`Creating author`);

    return this.authorModel.create({
      name: createAuthorDto.name,
      email: createAuthorDto.email,
    });
  }

  async findByEmail(email: string) {
    this.logger.log(`Finding author by email ${email}`);
    return this.authorModel.findOne({ email });
  }
}
