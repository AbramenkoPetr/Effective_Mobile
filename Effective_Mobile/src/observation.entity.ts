// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Requests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  theme: string;

  @Column('text')
  request: string;

  @Column()
  status: string;

  @Column()
  reason_for_cancellation: string;

  @Column('text')
  reply: string;

  @CreateDateColumn()
  //date: string;
  date: Date;
}
