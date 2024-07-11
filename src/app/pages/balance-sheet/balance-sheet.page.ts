import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IBalanceSheetReport } from 'src/app/viewModels/ibalance-sheet-report';
import { IBalanceSheetRequest } from 'src/app/viewModels/ibalance-sheet-request';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IChipOption } from '@app/viewModels/ichip-option';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { Subject, takeUntil } from 'rxjs';
import { ColumnDef } from '@app/viewModels/column-def';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.page.html',
  styleUrls: ['./balance-sheet.page.scss'],
})
export class BalanceSheetPage implements OnInit {
  private destroy$ = new Subject<void>();

  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }

  columns: ColumnDef[] = [
    {
      displayName: 'اسم الحساب',
      field: 'accountName',
      visible: true,
      hasTotal: false,
    },
    {
      displayName: 'الرقم',
      field: 'accountNumber',
      visible: true,
      hasTotal: false,
    },
    { displayName: 'مدين', field: 'madeen', visible: true, hasTotal: true },
    { displayName: 'دائن', field: 'dain', visible: true, hasTotal: true },
  ];

  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getBalanceSheetReport(this.balanceSheetRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.maxCount = this.apiService.getCurrentReportTotalCount;
          this.loading = false;
          this.tableDataService.updateTableData(res);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
  //////
  levels!: number[];
  totalMadeen!: number;
  totalDain!: number;
  allLevels: ILevels = {
    0: 'كافة المستويات',
    1: 'المستوى الأول',
    2: 'المستوى الثاني',
    3: 'المستوى الثالث',
    4: 'المستوى الرابع',
    5: 'المستوى الخامس',
    6: 'المستوى السادس',
    'كافة المستويات': 0,
    'المستوى الأول': 1,
    'المستوى الثاني': 2,
    'المستوى الثالث': 3,
    'المستوى الرابع': 4,
    'المستوى الخامس': 5,
    'المستوى السادس': 6,
  };

  filterForm!: FormGroup;

  // declare page properties
  dateOptions!: IChipOption[];
  balanceSheetReport!: IBalanceSheetReport[];
  balanceSheetRequest!: IBalanceSheetRequest;
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  constructor(
    private apiService: APIService,
    private modalController: ModalController,
    private TimeService: TimeService,
    private tableDataService: SharedTableDataService
  ) {
    this.tableDataService.setCurrentReportType('balanceSheet');
    this.tableDataService.setColumnDefs(this.columns);
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });

    this.dateOptions = [
      {
        name: 'حتى يوم',
        id: 0,
        clicked: true,
      },
    ];

    this.filterForm = new FormGroup({
      level: new FormControl('كافة المستويات', Validators.required),
      isBeforeRelay: new FormControl(false, Validators.required),
      maxTimeValue: new FormControl(
        this.TimeService.getCurrentDate(),
        Validators.required
      ),
    });
  }

  ngOnInit() {
    this.levels = [0];
    this.apiService
      .getAccountsLevels()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.levels = this.levels.concat(data)),
      });
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  createRequestFilters() {
    this.balanceSheetRequest = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      Level: Number(this.allLevels[this.filterForm.get('level')?.value]),
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
  }
  filterReport() {
    if (this.filterForm.invalid) {
      return;
    }
    this.totalDain = 0;
    this.totalMadeen = 0;
    this.modalController.dismiss();
    this.loading = true;

    this.createRequestFilters();
    this.apiService
      .getBalanceSheetReport(this.balanceSheetRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: IBalanceSheetReport[]) => {
          this.tableDataService.setTableData(data);
          this.maxCount = this.apiService.currentReportTotalCount;
          this.balanceSheetReport = data;
          this.loading = false;
        },
        error: (error: any) => {
          console.log(error.message);
          this.loading = false;
        },
      });
  }
  ngOnDestroy() {
    this.tableDataService.deleteTableColumns();
    this.tableDataService.deleteTableData();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
interface ILevels {
  [key: string]: number | string;
  [key: number]: number | string;
}
