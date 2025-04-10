import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TaskResult {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    taskId: string;

    @Column()
    result: string;

    @Column()
    createdAt: Date;
}