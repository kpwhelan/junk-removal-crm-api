import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
  imports: [
    TypeOrmModule.forFeature([Job]),
    TypeOrmModule.forFeature([Job, Customer]),
  ],
})
export class JobsModule {}
