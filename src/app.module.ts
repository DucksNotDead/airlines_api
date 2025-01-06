import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { CompaniesModule } from './companies/companies.module';
import { CashDesksModule } from './cash-desks/cash-desks.module';
import { CashiersModule } from './cashiers/cashiers.module';
import { ClientsModule } from './clients/clients.module';
import { TicketsModule } from './tickets/tickets.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    DbModule,
    UsersModule,
    CompaniesModule,
    CashDesksModule,
    CashiersModule,
    ClientsModule,
    TicketsModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
