import { Injectable } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { ConversationService } from './conversation.service';
import { TaskService } from './tasks.service';
import { Task } from 'src/entities/task.entity';
import { CronJob } from 'cron';
import { Logger } from '@nestjs/common';
import { NewsService } from './news.service';
import { SchedulerRegistry } from '@nestjs/schedule';
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly conversationService: ConversationService,
    private readonly taskService: TaskService,
    private readonly newsService: NewsService,
    private readonly schedulerRegistry: SchedulerRegistry,
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
      let taskData: Task | null = null;
      let aiMessage = response.message || '';

      taskData = await this.tryExtractTaskData(
        aiMessage,
        currentConversationId,
      );
      if (taskData) {
        aiMessage =
          '✅ 任务创建成功！我们将根据你的要求进行新闻收集和分析，你可以在任务列表中查看任务详情。';
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
        task: taskData,
      };
    } catch (error) {
      console.error('Chat processing error:', error);
      return this.handleError(conversationId);
    }
  }

  private async tryExtractTaskData(
    aiMessage: string,
    conversationId: string,
  ): Promise<Task | null> {
    try {
      const jsonMatch = aiMessage.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const extractedData = JSON.parse(jsonStr) as Task;

        if (
          extractedData.keywords &&
          extractedData.executionInterval &&
          extractedData.analysisMethod &&
          extractedData.cronExpression
        ) {
          const task = await this.taskService.storeTask(
            conversationId,
            extractedData,
          );
          const job = new CronJob(`${task.cronExpression}`, () => {
            this.newsService.analyzeNewsByAI(task.id, task.keywords, task.analysisMethod);
          });
          this.schedulerRegistry.addCronJob(task.id, job);
          job.start();
          return task;
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
        "抱歉，我目前无法处理你的请求。",
      timestamp: new Date().toISOString(),
      status: 'error',
      error: 'Unknown error',
      conversationId,
    };
  }
}
