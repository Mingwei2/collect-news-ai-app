import { Module } from '@nestjs/common';
import { TaskService } from '../services/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TaskController } from '../controllers/tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TasksModule {}
