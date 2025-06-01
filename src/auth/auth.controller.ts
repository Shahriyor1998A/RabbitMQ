import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { JwtAuth } from './dto/jwt-auth.guard'
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login qilish' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Ro‘yxatdan o‘tish' })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('confirm')
  @ApiOperation({ summary: 'Emailni tasdiqlash' })
  confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }
}

