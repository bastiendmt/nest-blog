import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FilterArticleDto {
  @IsOptional()
  author?: string;

  @IsOptional()
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  cursor?: string;
}
