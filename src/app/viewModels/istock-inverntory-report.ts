export interface IStockInverntoryReport {
    [key: string]: any;
    itemID: number;
    brandName: string;
    itemNumber: number;
    itemName: string;
    stockQuantity: number;
    unitName: string;
    stockUnitCost: number;
    stockTotalCost: number;
    theDate: string;
    storeID: number;
    storeName: string;
    branchID: number;
    branchName: string;
    maxUnitDescription: string;
}
