import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenAiService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './services/conversation.service';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, TaskController, ChatController],
  providers: [OpenAiService, ConversationService, TaskService, ChatService],
})
export class AppModule {}
