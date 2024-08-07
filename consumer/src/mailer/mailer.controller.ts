import { Controller } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateArticleDto } from './article.dto';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern('ARTICLE_CREATED')
  handleArticleCreatedEvent(@Payload() article: CreateArticleDto) {
    this.mailerService.sendNewArticleNotification(article);
  }
}
