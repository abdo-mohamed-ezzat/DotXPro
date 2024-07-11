import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { IIncomeStatementReport } from 'src/app/viewModels/iincome-statement-report';
import { IIncomeStatementRequest } from 'src/app/viewModels/iincome-statement-request';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.page.html',
  styleUrls: ['./income-statement.page.scss'],
})
export class IncomeStatementPage implements OnInit {
  private destroy$ = new Subject<void>();

  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }
  getColumnDefs(showCostCenter: boolean): ColumnDef[] {
    const columns: ColumnDef[] = [
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
      {
        displayName: 'مركز التكلفة',
        field: 'costCenterName',
        visible: showCostCenter,
        hasTotal: false,
      },
      { displayName: 'مدين', field: 'madeen', visible: true, hasTotal: true },
      { displayName: 'دائن', field: 'dain', visible: true, hasTotal: true },
    ];

    return columns.map((col) => ({ ...col }));
  }
  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getIncomeStatementReport(this.incomeStatementRequest)
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
  //declare page properties
  incomeStatementReport!: IIncomeStatementReport[];
  incomeStatementRequest!: IIncomeStatementRequest;
  dateOptions!: IChipOption[];
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  dataSource!: MatTableDataSource<IIncomeStatementReport>;

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

  levels!: number[];

  // declare request properties
  totalMadeen!: number;
  totalDain!: number;
  time!: string;
  filterForm!: FormGroup;
  constructor(
    private timeService: TimeService,
    private apiService: APIService,
    private modalController: ModalController,
    private tableDataService: SharedTableDataService
  ) {
    this.tableDataService.setCurrentReportType('incomeStatement');
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });
    this.tableDataService.setColumnDefs(this.getColumnDefs(false));

    //intialize form
    this.filterForm = new FormGroup({
      level: new FormControl('كافة المستويات', Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(
        this.timeService.getMinTimeValue(),
        Validators.required
      ),
      maxTimeValue: new FormControl(
        this.timeService.getCurrentDate(),
        Validators.required
      ),
      isBeforeRelay: new FormControl(false, Validators.required),
      underLockDown: new FormControl(false, Validators.required),
      showCostCenter: new FormControl(false, Validators.required),
    });

    // intialize page properties
    this.totalMadeen = 0;
    this.totalDain = 0;

    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];
  }

  ngOnInit() {
    this.filterForm
      .get('showCostCenter')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.tableDataService.setColumnDefs(this.getColumnDefs(value));
      });
    this.levels = [0];
    this.apiService
      .getAccountsLevels()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (levels: number[]) => {
          this.levels = this.levels.concat(levels);
        },
      });
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  createRequestFilters() {
    this.incomeStatementRequest = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      Level: Number(this.allLevels[this.filterForm.get('level')?.value]),
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      UnderLockDown: this.filterForm.get('underLockDown')?.value,
      ShowCostCenter: this.filterForm.get('showCostCenter')?.value,
    };
  }

  filterReport() {
    if (this.filterForm.invalid) return;
    this.modalController.dismiss();
    this.loading = true;

    this.createRequestFilters();
    this.apiService
      .getIncomeStatementReport(this.incomeStatementRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (report: IIncomeStatementReport[]) => {
          this.incomeStatementReport = report;
          this.tableDataService.setTableData(report);
          this.maxCount = this.apiService.getCurrentReportTotalCount;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
  }
  // set emited values
  setDateOption(dateOptions: IChipOption) {
    this.filterForm.get('time')?.setValue(dateOptions.name);
    this.time = dateOptions.name;
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
