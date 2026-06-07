import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
  ) {}

  async findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  async findOneById(id: number): Promise<Job | null> {
    return this.jobRepository.findOneBy({ id });
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const job = this.jobRepository.create(dto);
    return this.jobRepository.save(job);
  }

  async update(id: number, dto: UpdateJobDto): Promise<Job> {
    const job = await this.jobRepository.findOneBy({ id });

    if (!job) {
      throw new NotFoundException(`Job with ID: ${id} not found`);
    }

    Object.assign(job, dto);
    return this.jobRepository.save(job);
  }

  async delete(id: number): Promise<void> {
    const result = await this.jobRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID: ${id} not found`);
    }
  }

  async findByCustomerId(customerId: number): Promise<Job[]> {
    return this.jobRepository.find({
      where: { customerId },
      relations: { customer: true },
      order: { createdAt: 'DESC' },
    });
  }
}
