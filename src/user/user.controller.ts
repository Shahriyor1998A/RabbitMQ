import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @MessagePattern({ cmd: 'get_user_by_email' })
  async getUserByEmail(@Payload() email: string) {
    return this.userService.findByEmail(email);
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAll() {
    return this.userService.findAll();
  }

  @MessagePattern({ cmd: 'delete_user' })
  async delete(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
