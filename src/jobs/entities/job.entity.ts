import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { JobStatus } from '../enums/job-status.enum';
import { ManyToOne } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerId!: number;

  @ManyToOne(() => Customer, (customer) => customer.jobs)
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.SCHEDULED,
  })
  status!: JobStatus;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate?: Date;

  @Column({ nullable: true })
  streetAddress?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quotedPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  leadSource?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
