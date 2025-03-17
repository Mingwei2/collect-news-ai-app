import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  keywords: string;

  @Column()
  executionInterval: string;

  @Column()
  analysisMethod: string;

  @Column()
  createdAt: Date;
}
