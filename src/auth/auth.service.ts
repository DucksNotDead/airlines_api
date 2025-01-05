import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../db/db.service';
import {AUTH_TOKEN_KEY} from "../../shared/const";

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  genToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      { expiresIn: process.env.APP_TOKEN_LIFE },
    );
  }

  getUserIdFromToken(token: string) {
    const { userId } = this.jwtService.verify(token);
    return userId;
  }

  createCookie(token: string) {
    return [
      AUTH_TOKEN_KEY,
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 * 1000 * 24,
      },
    ] as const;
  }
}
