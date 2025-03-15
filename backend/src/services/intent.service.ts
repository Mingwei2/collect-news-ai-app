import { Injectable } from '@nestjs/common';

export interface UserIntent {
  id: string;
  keywords: string;
  executionInterval: string;
  analysisMethod: string;
  createdAt: Date;
}

@Injectable()
export class IntentService {
  private intents: Map<string, UserIntent> = new Map();

  storeIntent(id: string, intentData: UserIntent): UserIntent {
    try {
      if (
        !intentData.keywords ||
        !intentData.executionInterval ||
        !intentData.analysisMethod
      ) {
        throw new Error('Incomplete intent data');
      }

      const userIntent: UserIntent = {
        id,
        keywords: intentData.keywords,
        executionInterval: intentData.executionInterval,
        analysisMethod: intentData.analysisMethod,
        createdAt: new Date(),
      };

      this.intents.set(id, userIntent);
      return userIntent;
    } catch (error) {
      console.error('Error storing intent:', error);
      throw error;
    }
  }

  getIntent(id: string): UserIntent | undefined {
    return this.intents.get(id);
  }

  getAllIntents(): UserIntent[] {
    return Array.from(this.intents.values());
  }
}
