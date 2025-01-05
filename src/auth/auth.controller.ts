import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserCredits } from '../../shared/entities/user';
import { Public } from '../../shared/decorators/public.method';
import { AUTH_TOKEN_KEY } from '../../shared/const';
import { UserParam } from '../../shared/decorators/user.param';
import { UserRole } from '../../shared/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() credits: UserCredits, @Res() res: Response) {
    const candidate = await this.usersService.findByLogin(credits.login);
    if (candidate) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.create({
      ...credits,
      role: UserRole.Client,
    });
    if (!user) {
      throw new BadRequestException();
    }

    const token = this.authService.genToken(user.id);
    if (!token) {
      throw new BadRequestException();
    }

    return res.cookie(...this.authService.createCookie(token)).json(user);
  }

  @Public()
  @Post('login')
  async login(@Body() credits: UserCredits, @Res() res: Response) {
    const user = await this.usersService.findByCredits(credits);
    if (!user) {
      throw new BadRequestException();
    }

    const token = this.authService.genToken(user.id);
    if (!token) {
      throw new BadRequestException();
    }

    return res.cookie(...this.authService.createCookie(token)).json(user);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return res
      .clearCookie(AUTH_TOKEN_KEY)
      .json({ message: 'Logout successful' });
  }

  @Get()
  async auth(@UserParam() user: User, @Res() res: Response) {
    return res.status(HttpStatus.OK).json(user);
  }
}
