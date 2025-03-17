import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
      status: 'success',
    };
  }
}
