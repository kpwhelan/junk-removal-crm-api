import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export default class CreateUserDto {
  @IsString()
  @Length(1, 255)
  firstName!: string;

  @IsString()
  @Length(1, 255)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 255)
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
