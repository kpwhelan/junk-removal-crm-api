import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsQueryDto } from './dto/find-jobs-query.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  index(): Promise<Job[]> {
    return this.jobsService.findAll();
  }

  @Get()
  findAll(@Query() query: FindJobsQueryDto): Promise<Job[]> {
    return this.jobsService.findAll(query);
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id: number): Promise<Job | null> {
    return this.jobsService.findOneById(id);
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto): Promise<Job> {
    console.log(createJobDto);
    return this.jobsService.create(createJobDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<Job | null> {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.jobsService.delete(id);
  }
}
