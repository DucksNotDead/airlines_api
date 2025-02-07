export class CompanyWithSumRate {
  code: string;
  name: string;
  address: string;
  total: string;
}

export class TotalAmountOfEachCompanyResponse {
  companies: CompanyWithSumRate[];
}