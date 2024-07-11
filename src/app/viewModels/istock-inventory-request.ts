export interface IStockInventoryRequest {
    [key: string]: any;
    PageNumber: number;
    PageSize: number;
    TheMaxDate: string;
    ItemName: string;
    StoreName: string[];
    IsInTheStock: boolean;
}
