import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ColumnDef } from '@app/viewModels/column-def';

@Injectable({
  providedIn: 'root',
})
export class SharedTableDataService {
  private tableDataSubject = new BehaviorSubject<any[]>([]);
  tableData$ = this.tableDataSubject.asObservable();

  private ReportTypeSubject = new BehaviorSubject<string>('');
  ReportType$ = this.ReportTypeSubject.asObservable();
  
  private currentPageIndexSubject = new BehaviorSubject<number>(1);

  private currentColumnsSubject = new BehaviorSubject<any[]>([]);
  currentColumns$ = this.currentColumnsSubject.asObservable();

  private currentTotalCount = new BehaviorSubject<number>(0);
  currentTotalCount$ = this.currentTotalCount.asObservable();
  setTableData(tableData: any[]) {
    this.tableDataSubject.next(tableData);
  }
  getTableData() {
    return this.tableDataSubject.value;
  }

  setCurrentReportType(reportType: string) {
    this.ReportTypeSubject.next(reportType);
  }

  getCurrentReportType() {
    return this.ReportTypeSubject.value;
  }
  deleteTableData() {
    this.tableDataSubject.next([]);
  }
  updateTableData(updatedData: any[]) {
    const currentData = this.tableDataSubject.value;
    const mergedData = [...currentData, ...updatedData];
    this.tableDataSubject.next(mergedData);
  }
  setCurrentPageIndex(pageIndex: number){
    this.currentPageIndexSubject.next(pageIndex);
  }
  getCurrentPageIndex() : Observable<number>{
    return this.currentPageIndexSubject;
  }

  fetchMoreData(pageIndex: number){
    this.setCurrentPageIndex(pageIndex);
  }

  setColumnDefs(columnDefs: ColumnDef[]) {
    this.currentColumnsSubject.next(columnDefs);
  }
  getColumnDefs() {
    return this.currentColumnsSubject.value;
  }
  deleteTableColumns() {
    this.currentColumnsSubject.next([]);
  }

  setTotalCount(totalCount: number) {
    this.currentTotalCount.next(totalCount);
  }
  constructor() {}
}

