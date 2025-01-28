import { TicketType } from '../../../shared/entities/ticket';
import { Cashier } from '../../../shared/entities/cashier';
import { CashDesk } from '../../../shared/entities/cash-desk';
import { TicketClient } from '../../../shared/entities/client';
import { TicketCoupon } from '../../../shared/entities/coupon';

export class TicketsByCompanyAndMonthResponse {
  id: number;
  buy_date: string;
  type: TicketType;
  cashier: Cashier;
  cash_desk: CashDesk;
  client: TicketClient;
  coupons: TicketCoupon[];
}
