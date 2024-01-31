export interface IIncomeStatementRequest {
  [key: string]: any;
  PageNumber: number,
  PageSize: number,
  Level: number;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
  IsBeforeRelay: boolean;
  UnderLockDown: boolean;
  ShowCostCenter: boolean;
}
