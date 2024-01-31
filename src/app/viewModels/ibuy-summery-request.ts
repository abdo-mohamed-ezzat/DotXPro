export interface IBuySummeryRequest {
  PageNumber: number;
  PageSize: number;
  TypeOfReport: string;
  ItemName: string;
  SupplierID: number;
  TheMethodName: string;
  CategoryID: number;
  IsRedoneConnectedToBuy: boolean;
  Time: string;
  MinTimeValue: string;
  MaxTimeValue: string;
}
