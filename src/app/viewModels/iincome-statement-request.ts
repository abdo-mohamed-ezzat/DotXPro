export interface IIncomeStatementRequest {
  [key: string]: any;
  Level: number;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
  IsBeforeRelay: boolean;
  UnderLockDown: boolean;
  ShowCostCenter: boolean;
}
