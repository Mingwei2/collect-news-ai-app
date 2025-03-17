import { Injectable } from '@nestjs/common';

export interface UserTask {
  id: string;
  keywords: string;
  executionInterval: string;
  analysisMethod: string;
  createdAt: Date;
}

@Injectable()
export class TaskService {
  private tasks: Map<string, UserTask> = new Map();

  storeTask(id: string, taskData: UserTask): UserTask {
    try {
      if (
        !taskData.keywords ||
        !taskData.executionInterval ||
        !taskData.analysisMethod
      ) {
        throw new Error('Incomplete task data');
      }

      const userTask: UserTask = {
        id,
        keywords: taskData.keywords,
        executionInterval: taskData.executionInterval,
        analysisMethod: taskData.analysisMethod,
        createdAt: taskData.createdAt || new Date(),
      };

      this.tasks.set(id, userTask);
      return userTask;
    } catch (error) {
      console.error('Error storing task:', error);
      throw error;
    }
  }

  getTask(id: string): UserTask | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): UserTask[] {
    return Array.from(this.tasks.values());
  }

  updateTask(id: string, taskData: UserTask): UserTask {
    this.tasks.set(id, taskData);
    return taskData;
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }
}
