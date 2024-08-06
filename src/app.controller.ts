import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({
    description: 'Returns the API status, uptime (seconds) and version',
  })
  @Get('healthcheck')
  getHealthCheck() {
    return this.appService.getUpTime();
  }
}
