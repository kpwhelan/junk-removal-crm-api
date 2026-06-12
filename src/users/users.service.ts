import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const email = dto.email.toLowerCase();

    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException(`User with email: ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (dto.email) {
      const email = dto.email.toLowerCase();

      const existingUser = await this.userRepository.findOneBy({ email });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(`User with email: ${email} already exists`);
      }

      dto.email = email;
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string | null,
  ): Promise<void> {
    const refreshTokenHash = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;

    await this.userRepository.update(userId, {
      refreshToken: refreshTokenHash,
    });
  }
}
