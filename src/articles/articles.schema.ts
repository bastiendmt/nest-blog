import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Author } from '../authors/authors.schema';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Author' })
  author: Author;

  @Prop([String])
  tags: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
