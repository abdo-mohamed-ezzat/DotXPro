export interface ITrialBalanceRequest {
  [x: string]: any;
  IsBeforeRelay: boolean;
  Level: number;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
}
