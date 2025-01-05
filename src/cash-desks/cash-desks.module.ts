import { Module } from '@nestjs/common';
import { CashDesksService } from './cash-desks.service';
import { CashDesksController } from './cash-desks.controller';

@Module({
  controllers: [CashDesksController],
  providers: [CashDesksService],
})
export class CashDesksModule {}
