import { Client } from '../../../shared/entities/client';

export class CompanyWithClients {
  code: string;
  name: string;
  address: string;
  clients: Client[];
}

export class ClientsOfEachCompanyByDateResponse {
  companies: CompanyWithClients[];
}