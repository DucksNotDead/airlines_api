export class CouponDto {
	id?: number;
	ticket_id?: number;
	index: number;
	from: string;
	to: string;
	rate: number;
}

export class TicketCoupon {
	id: number;
	index: number;
	from: string;
	to: string;
	rate: number;
}