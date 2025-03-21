import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
      status: 'success',
    };
  }
}
