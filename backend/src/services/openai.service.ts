import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private readonly openai: OpenAI | null;
  private readonly logger = new Logger(OpenAiService.name);

  constructor() {
    try {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || '',
        baseURL: process.env.OPENAI_BASE_URL,
      });
    } catch (error) {
      this.logger.error('Failed to initialize OpenAI client', error);
      this.openai = null;
    }
  }

  async createChatCompletion(
    messages: Array<{ role: string; content: string }>,
  ) {
    try {
      if (!this.openai) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        max_tokens: 500,
      });

      return {
        message: response.choices[0].message.content,
        timestamp: new Date().toISOString(),
        status: 'success',
      };
    } catch (error) {
      this.logger.error('Error in OpenAI API call', error);
      throw error;
    }
  }
}
