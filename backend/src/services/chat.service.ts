import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { ConversationService } from './conversation.service';
import { TaskService, UserTask } from './task.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly conversationService: ConversationService,
    private readonly taskService: TaskService,
  ) {}

  async processChat(message: string, conversationId?: string) {
    try {
      let currentConversationId = conversationId;

      if (!currentConversationId) {
        currentConversationId = this.conversationService.createConversation();
      }

      this.conversationService.addMessage(
        currentConversationId,
        'user',
        message,
      );

      const messages = this.conversationService.getFormattedMessages(
        currentConversationId,
      );

      const response = await this.openAiService.createChatCompletion(messages);
      let taskData: UserTask | null = null;
      let aiMessage = response.message || '';

      taskData = this.tryExtractTaskData(aiMessage, currentConversationId);
      if (taskData) {
        aiMessage =
          '✅ Task created successfully! We will proceed with news collection and analysis according to your requirements.';
        response.message = aiMessage;
      }

      this.conversationService.addMessage(
        currentConversationId,
        'assistant',
        aiMessage,
      );

      return {
        ...response,
        conversationId: currentConversationId,
        taskCollected: !!taskData,
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      return this.handleError(conversationId);
    }
  }

  private tryExtractTaskData(
    aiMessage: string,
    conversationId: string,
  ): UserTask | null {
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
          this.taskService.storeTask(conversationId, extractedData);
          return extractedData;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to parse task JSON', error);
      return null;
    }
  }

  private handleError(conversationId?: string) {
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
