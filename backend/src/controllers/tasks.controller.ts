import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { TaskService } from '../services/tasks.service';
import { Task } from '../entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getAllTasks(@Query('limit') limit?: string) {
    const tasks = await this.taskService.getAllTasks();

    if (limit) {
      const limitNum = parseInt(limit, 10);
      return tasks.slice(0, limitNum);
    }

    return tasks;
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    const task = await this.taskService.getTask(id);
    const results = await this.taskService.getTaskResults(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { ...task, results };
  }

  @Post()
  async createTask(@Body() taskData: Omit<Task, 'id' | 'createdAt'>) {
    const id = Date.now().toString();
    return this.taskService.storeTask(id, {
      ...taskData,
      id,
      createdAt: new Date(),
    });
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateData: Partial<Omit<Task, 'id' | 'createdAt'>>,
  ) {
    const existingTask = await this.taskService.getTask(id);
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const updatedTask = {
      ...existingTask,
      ...updateData,
    };

    return this.taskService.updateTask(id, updatedTask);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    const task = await this.taskService.getTask(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.taskService.deleteTask(id);
    return { success: true, message: `Task with ID ${id} has been deleted` };
  }

  @Get(':id/results')
  async getTaskResults(@Param('id') id: string) {
    const task = await this.taskService.getTask(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // 这里是模拟数据，实际应用中可能会从新闻API或数据库中获取
    return [
      {
        id: '1',
        title: `${task.keywords} - Latest Development`,
        source: 'Tech Daily',
        date: new Date().toISOString().split('T')[0],
        summary: `Recent news about ${task.keywords} shows significant developments in the field.`,
        url: 'https://example.com/news/1',
      },
      {
        id: '2',
        title: `Analysis: Impact of ${task.keywords}`,
        source: 'Industry Journal',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // 昨天
        summary: `Experts analyze how ${task.keywords} is affecting various sectors and predict future trends.`,
        url: 'https://example.com/news/2',
      },
      {
        id: '3',
        title: `${task.keywords} Market Overview`,
        source: 'Financial Times',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 前天
        summary: `Market overview shows increasing interest in ${task.keywords}, with investments growing by 15%.`,
        url: 'https://example.com/news/3',
      },
    ];
  }
}
