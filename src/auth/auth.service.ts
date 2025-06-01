import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EmailService } from '../user/email.service'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService, 
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(userDto: CreateUserDto) {
    const user = await this.usersService.create(userDto);
    const token = this.jwtService.sign(
      { email: user.email },
      { secret: 'EMAIL_VERIFICATION_SECRET', expiresIn: '1d' },
    );
    await this.emailService.sendVerificationEmail(user.email, token);
    return { message: 'Tasdiqlash emaili yuborildi' };
  }

  async confirmEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: 'EMAIL_VERIFICATION_SECRET',
      });
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new Error('Foydalanuvchi topilmadi');
      }
      user.isEmailConfirmed = true;
      await this.usersService.update(user.id, user);
      return { message: 'Email tasdiqlandi' };
    } catch (e) {
      throw new Error('Noto‘g‘ri yoki eskirgan token');
    }
  }
}
