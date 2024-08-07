import { Injectable, Logger } from '@nestjs/common';
import { CreateArticleDto } from './article.dto';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  async sendNewArticleNotification(article: CreateArticleDto) {
    this.logger.log(
      `Sending email notification for new article: ${article.title}`,
    );
    // Implement email sending logic
  }
}
