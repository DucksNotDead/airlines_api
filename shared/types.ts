export enum UserRole {
  Admin = 'Admin',
  Cashier = 'Cashier',
  Employee = 'Employee',
  Client = 'Client',
}

export type TRole = keyof typeof UserRole;

export type TTicketStatus = 'for_sale' | 'sold' | 'under_control';
