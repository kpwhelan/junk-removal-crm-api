import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { JobStatus } from '../enums/job-status.enum';
import { Type } from 'class-transformer';
import { CreateCustomerDto } from 'src/customers/dto/create-customer.dto';

export class CreateJobDto {
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer?: CreateCustomerDto;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  streetAddress?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  quotedPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  finalPrice?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  leadSource?: string;
}
