export interface IBuySummeryReport {
  clientName: string;
  theDate: string;
  theMethod: string;
  currencyName: string;
  recordNumber: string;
  totalBuy: number;
  totalRedone: number;
  totalNet: number;
  totalMcNet: number;
  totalNetTaxValue: number;
  netAmount: number;
  netMcAmount: number;
  صافي_الضريبة: number;
}
