export interface ColumnDef {
    [key: string]: any;
    displayName: string;
    field: string;
    visible: boolean;
    hasSubHeaders?: boolean;
    subHeaders?: ColumnDef[];
    hasTotal?: boolean;
}
