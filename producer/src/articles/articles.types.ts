import { Article } from './articles.schema';

export class FilterResponse {
  nextCursor: string | null;
  hasNextPage: boolean;
  articles: Article[];
}
