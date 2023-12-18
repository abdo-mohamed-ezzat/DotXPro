import { Iitem } from "./iitem";

export interface ISalesSummeryRequest {
    [key: string]: any;
    TypeOfReport: 'اجمالي' | 'تفصيلي',
    ItemName: string | Iitem,
    Time: string,
    MinTimeValue?: string,
    MaxTimeValue: string,
    TheMethodName: string,
    ClientName: string,
}
