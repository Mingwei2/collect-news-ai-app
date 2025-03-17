import { Injectable } from '@nestjs/common';
import { OpenAiService } from './services/openai.service';
import { ConversationService } from './services/conversation.service';
import { TaskService, UserTask } from './services/task.service';

@Injectable()
export class AppService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly conversationService: ConversationService,
    private readonly taskService: TaskService,
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
      let taskData: UserTask | null = null;
      let aiMessage = response.message || '';

      try {
        const jsonMatch = aiMessage.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const extractedData = JSON.parse(jsonStr) as UserTask;

          if (
            extractedData.keywords &&
            extractedData.executionInterval &&
            extractedData.analysisMethod
          ) {
            taskData = extractedData;

            this.taskService.storeTask(conversationId, taskData);

            aiMessage =
              '✅ Task created successfully! We will proceed with news collection and analysis according to your requirements.';

            response.message = aiMessage;
          }
        }
      } catch (error) {
        console.error('Failed to parse task JSON', error);
      }

      this.conversationService.addMessage(
        conversationId,
        'assistant',
        aiMessage,
      );

      return {
        ...response,
        conversationId,
        taskCollected: !!taskData,
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
