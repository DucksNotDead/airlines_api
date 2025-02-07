import { Module } from '@nestjs/common';
import { CashiersService } from './cashiers.service';
import { CashiersController } from './cashiers.controller';

@Module({
  controllers: [CashiersController],
  providers: [CashiersService],
  exports: [CashiersService],
})
export class CashiersModule {}
