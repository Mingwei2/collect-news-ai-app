import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAiService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './services/conversation.service';
import { IntentService } from './services/intent.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, OpenAiService, ConversationService, IntentService],
})
export class AppModule {}
