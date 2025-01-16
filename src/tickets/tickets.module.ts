import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { ClientsModule } from '../clients/clients.module';
import { UsersModule } from '../users/users.module';
import { CouponsModule } from '../coupons/coupons.module';

@Module({
  imports: [ClientsModule, UsersModule, CouponsModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
