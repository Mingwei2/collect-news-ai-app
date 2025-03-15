import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('chat')
  async chat(@Body() body: { message: string; conversationId?: string }) {
    return this.appService.chatWithAI(body.message, body.conversationId);
  }
}
