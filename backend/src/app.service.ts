import { Injectable } from '@nestjs/common';
import { OpenAiService } from './services/openai.service';
import { ConversationService } from './services/conversation.service';
import { IntentService, UserIntent } from './services/intent.service';

@Injectable()
export class AppService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly conversationService: ConversationService,
    private readonly intentService: IntentService,
  ) {}

  getHello() {
    return {
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
      status: 'success',
    };
  }

  async chatWithAI(userMessage: string, conversationId?: string) {
    try {
      if (!conversationId) {
        conversationId = this.conversationService.createConversation();
      }

      this.conversationService.addMessage(conversationId, 'user', userMessage);

      const messages =
        this.conversationService.getFormattedMessages(conversationId);
      const response = await this.openAiService.createChatCompletion(messages);
      let intentData: UserIntent | null = null;
      let aiMessage = response.message || '';

      try {
        const jsonMatch = aiMessage.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const extractedData = JSON.parse(jsonStr) as UserIntent;

          if (
            extractedData.keywords &&
            extractedData.executionInterval &&
            extractedData.analysisMethod
          ) {
            intentData = extractedData;

            this.intentService.storeIntent(conversationId, intentData);

            aiMessage =
              '✅ Intent collected successfully! We will proceed with news collection and analysis according to your requirements.';

            response.message = aiMessage;
          }
        }
      } catch (error) {
        console.error('Failed to parse intent JSON', error);
      }

      this.conversationService.addMessage(
        conversationId,
        'assistant',
        aiMessage,
      );

      return {
        ...response,
        conversationId,
        intentCollected: !!intentData,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        message:
          "I'm sorry, I'm having trouble processing your request right now.",
        timestamp: new Date().toISOString(),
        status: 'error',
        error: 'Unknown error',
        conversationId,
      };
    }
  }
}
