import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';

export class FindJobsQueryDto {
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}
