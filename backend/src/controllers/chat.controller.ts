import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { NewsService } from '../services/news.service';
interface ChatRequestDto {
  message: string;
  conversationId?: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly newsService: NewsService) { }

  @Post()
  async chatWithAI(@Body() chatRequest: ChatRequestDto) {
    const { message, conversationId } = chatRequest;
    return this.chatService.processChat(message, conversationId);
  }
}
