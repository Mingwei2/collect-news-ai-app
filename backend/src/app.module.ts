import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenAiService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './services/conversation.service';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { NewsService } from './services/news.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskResult } from './entities/taskResult.entity';
import { Task } from './entities/task.entity';
import { TaskService } from './services/tasks.service';
import { TaskController } from './controllers/tasks.controller';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Task, TaskResult]),
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, ChatController, TaskController],
  providers: [OpenAiService, ConversationService, ChatService, NewsService, TaskService],
})
export class AppModule { }
