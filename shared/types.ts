export enum UserRole {
  Admin = 'Admin',
  Cashier = 'Cashier',
  Employee = 'Employee',
  Client = 'Client',
}

export type TRole = (keyof typeof UserRole);
