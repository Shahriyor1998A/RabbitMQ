import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepo.create({ ...createUserDto, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find();
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {
  await this.userRepo.update(id, updateUserDto);
  const user = await this.userRepo.findOneBy({ id });
  if (!user) {
    throw new NotFoundException('Foydalanuvchi topilmadi');
  }
  return user;
}

  async findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async remove(id: number) {
    return this.userRepo.delete(id);
  }
}
