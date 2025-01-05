import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';

@Module({
  imports: [AuthModule, DbModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
