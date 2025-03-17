import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAiService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './services/conversation.service';
import { TaskService } from './services/task.service';
import { TaskController } from './controllers/task.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, TaskController],
  providers: [AppService, OpenAiService, ConversationService, TaskService],
})
export class AppModule {}
