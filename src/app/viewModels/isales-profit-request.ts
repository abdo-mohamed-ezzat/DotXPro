export interface ISalesProfitRequest {
  PageSize: number;
  PageNumber: number;
  TypeOfReport: string;
  ItemName: string;
  ClientName: string;
  SupplierID: number;
  CostCenterName: string;
  CategoryID: number;
  Time: string;
  MinTimeValue?: string;
  MaxTimeValue: string;
}
