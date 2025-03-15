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

  private readonly systemPrompt = `You are a user intent collector. Your role is to gather the user's intentions and provide structured feedback. You need to determine which aspects of news the user wants to know about (keywords), how often they want to execute the news collection task (execution interval), and the method for analyzing and organizing the news (analysis method).

When you have collected all necessary information, respond with a structured JSON format:

{
  "keywords": "user specified keywords",
  "executionInterval": "user specified time interval",
  "analysisMethod": "user specified analysis method"
}

Be friendly and professional in your interactions. If the user doesn't clearly specify any of these three pieces of information, politely ask for clarification. Keep your responses concise and focused on collecting these three key pieces of information.`;

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
