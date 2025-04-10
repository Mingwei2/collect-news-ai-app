import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskResult } from '../entities/taskResult.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskResult)
    private taskResultsRepository: Repository<TaskResult>,
  ) { }

  async storeTask(id: string, taskData: Task): Promise<Task> {
    try {
      if (
        !taskData.keywords ||
        !taskData.executionInterval ||
        !taskData.cronExpression ||
        !taskData.analysisMethod
      ) {
        throw new Error('Incomplete task data');
      }

      const userTask: Task = {
        id,
        keywords: taskData.keywords,
        executionInterval: taskData.executionInterval,
        cronExpression: taskData.cronExpression,
        analysisMethod: taskData.analysisMethod,
        createdAt: taskData.createdAt || new Date(),
        status: 'running',
      };

      await this.tasksRepository.save(userTask);
      return userTask;
    } catch (error) {
      console.error('Error storing task:', error);
      throw error;
    }
  }

  async getTask(id: string): Promise<Task | null> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async updateTask(id: string, taskData: Task): Promise<Task> {
    await this.tasksRepository.update(id, taskData);
    return taskData;
  }

  async deleteTask(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async getTaskResults(id: string): Promise<TaskResult[]> {
    return this.taskResultsRepository.find({ where: { taskId: id }, order: { createdAt: 'DESC' } });
  }
}
