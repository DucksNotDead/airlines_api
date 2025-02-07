import { TicketType } from '../../../shared/entities/ticket';
import { Cashier } from '../../../shared/entities/cashier';
import { CashDesk } from '../../../shared/entities/cash-desk';
import { TicketClient } from '../../../shared/entities/client';
import { TicketCoupon } from '../../../shared/entities/coupon';

export class TicketByCompanyAndMonth {
  id: number;
  buy_date: string;
  type: TicketType;
  cashier: Cashier;
  cash_desk: CashDesk;
  client: TicketClient;
  coupons: TicketCoupon[];
}

export class TicketsByCompanyAndMonthResponse {
  tickets: TicketByCompanyAndMonth[];
  company_name: string;
}
