import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from '../services/chat.service';

interface ChatRequestDto {
  message: string;
  conversationId?: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chatWithAI(@Body() chatRequest: ChatRequestDto) {
    const { message, conversationId } = chatRequest;
    return this.chatService.processChat(message, conversationId);
  }
}
