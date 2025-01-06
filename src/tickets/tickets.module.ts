import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { ClientsModule } from '../clients/clients.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ClientsModule, UsersModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
