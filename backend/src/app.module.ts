import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OpenAiService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './services/conversation.service';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './modules/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TasksModule,
  ],
  controllers: [AppController, ChatController],
  providers: [OpenAiService, ConversationService, ChatService],
})
export class AppModule {}
