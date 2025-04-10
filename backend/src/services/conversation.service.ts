import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ConversationService {
  private conversations: Map<string, Conversation> = new Map();

  private readonly systemPrompt = `你是一个用户意图收集器。你的职责是收集用户的意图，并提供结构化的反馈。你需要确定用户想了解新闻的哪些方面（关键词），他们希望以什么频率执行新闻收集任务（执行间隔），以及分析和组织新闻的方法（分析方法）。

  当你收集齐了所有必要的信息后（重点：确保你已收集了*全部*信息），请使用以下结构化的 JSON 格式进行回应：
  
  {
    "keywords": "用户指定的关键词",
    "executionInterval": "用户指定的时间间隔",
    "cronExpression": "根据执行间隔转换得到的cron表达式",
    "analysisMethod": "用户指定的分析方法"
  }
  
  在互动中请保持友好和专业。如果用户没有明确说明这三项信息中的任何一项，请礼貌地请求澄清。保持你的回应简洁，并专注于收集这三个关键信息点。`;

  createConversation(): string {
    const conversationId = uuidv4();
    if (typeof conversationId !== 'string') {
      throw new Error('Failed to create conversation');
    }
    const conversation: Conversation = {
      id: conversationId,
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversationId, conversation);
    return conversationId;
  }

  getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
  ): Message {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    const message: Message = {
      role,
      content,
      timestamp: new Date(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();

    if (conversation.messages.length > 20) {
      const systemMessage = conversation.messages[0];
      const recentMessages = conversation.messages.slice(-19);
      conversation.messages = [systemMessage, ...recentMessages];
    }

    return message;
  }

  getMessages(conversationId: string): Message[] {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }
    return conversation.messages;
  }

  getFormattedMessages(
    conversationId: string,
  ): Array<{ role: string; content: string }> {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }

    return conversation.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}
