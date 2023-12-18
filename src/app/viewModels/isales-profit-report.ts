export interface ISalesProfitReport {
    id: number;
    branchID: number;
    branchName: string;
    recordID: number;
    theDate: Date;
    documentName: string;
    documentType: string;
    recordNumber: number;
    clientNumber: number;
    clientName: string;
    categoryName: string;
    itemNumber: number;
    itemName: string;
    unitName: string;
    saleQuantity: number;
    bonus: number;
    unitCost: number;
    allCostPrice: number;
    unitPrice: number;
    totalSellPrice: number;
    totalSellDiscount: number;
    totalSellPriceDiscount: number;
    sellProfit: number;
    sellProfitRate: number;
}
