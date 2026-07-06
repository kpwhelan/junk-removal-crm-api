import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsQueryDto } from './dto/find-jobs-query.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job) private readonly jobRepository: Repository<Job>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(query?: FindJobsQueryDto): Promise<Job[]> {
    const where: FindOptionsWhere<Job> = {};

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.city) {
      where.city = query.city;
    }

    if (query?.customerId) {
      where.customerId = Number(query.customerId);
    }

    return this.jobRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneById(id: number): Promise<Job | null> {
    return this.jobRepository.findOneBy({ id });
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const hasExistingCustomer =
      dto.customerId !== undefined && dto.customerId !== null;

    const hasNewCustomer = dto.customer !== undefined && dto.customer !== null;

    if (!hasExistingCustomer && !hasNewCustomer) {
      throw new BadRequestException(
        'Either customerId or customer is required.',
      );
    }

    if (hasExistingCustomer && hasNewCustomer) {
      throw new BadRequestException(
        'Provide either customerId or customer, not both.',
      );
    }

    let customer: Customer | null = null;

    if (hasExistingCustomer) {
      customer = await this.customerRepository.findOneBy({
        id: dto.customerId!,
      });
    } else {
      customer = this.customerRepository.create(dto.customer!);
      customer = await this.customerRepository.save(customer);
    }

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID: ${dto.customerId} not found`,
      );
    }

    const { customerId: _customerId, customer: _customer, ...jobData } = dto;

    const job = this.jobRepository.create({
      ...jobData,
      customerId: customer.id,
    });

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
