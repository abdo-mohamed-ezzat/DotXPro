export interface IBuySummeryRequest {
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
