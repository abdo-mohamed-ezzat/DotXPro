export interface IStockInventoryRequest {
    [key: string]: any;
    TheMaxDate: string;
    ItemName: string;
    StoreName: string[];
    IsInTheStock: boolean;
}
