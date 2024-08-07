import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

@Injectable()
export class AppService {
  private start = Date.now();

  getHello(): string {
    return 'Hello World!';
  }

  getUpTime() {
    const now = Date.now();
    return {
      status: 'API Online',
      uptime: Number((now - this.start) / 1000).toFixed(0),
      version: version,
    };
  }
}
