export interface IAccountStatementRequest {
  IsBeforeRelay: boolean;
  TypeOfReport: string;
  Currency: string;
  CostCenter: string;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
}
