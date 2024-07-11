export interface ITrialBalanceRequest {
  [x: string]: any;
  PageSize: number;
  PageNumber: number;
  IsBeforeRelay: boolean;
  Level: number;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
}
