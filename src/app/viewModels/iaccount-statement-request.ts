export interface IAccountStatementRequest {
  PageNumber: number;
  PageSize: number;
  IsBeforeRelay: boolean;
  TypeOfReport: string;
  Currency: string;
  CostCenter: string;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
}
