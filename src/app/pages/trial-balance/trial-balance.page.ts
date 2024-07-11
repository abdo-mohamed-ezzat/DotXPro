import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { IonModal, ModalController } from '@ionic/angular';
import { Subject, takeUntil } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ITrialBalanceReport } from 'src/app/viewModels/itrial-balance-report';
import { ITrialBalanceRequest } from 'src/app/viewModels/itrial-balance-request';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.page.html',
  styleUrls: ['./trial-balance.page.scss'],
})
export class TrialBalancePage implements OnInit {
  private destroy$ = new Subject<void>();

  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }

  columnDefs: ColumnDef[] = [
    {
      field: 'accountName',
      displayName: 'اسم الحساب',
      visible: true,
      hasSubHeaders: false,
      hasTotal: false,
    },
    {
      field: 'accountNumber',
      displayName: 'الرقم',
      visible: true,
      hasSubHeaders: false,
      hasTotal: false,
    },
    {
      field: 'balance1',
      displayName: 'رصيد أول فترة',
      visible: true,
      hasTotal: true,
      hasSubHeaders: true,
      subHeaders: [
        { field: 'dain', displayName: 'دائن', visible: true, hasTotal: true },
        { field: 'md1', displayName: 'مدين', visible: true, hasTotal: true },
      ],
    },
    {
      field: 'movement',
      displayName: 'حركة الفترة',
      hasSubHeaders: true,
      visible: true,
      hasTotal: true,
      subHeaders: [
        { field: 'dain2', displayName: 'دائن', visible: true, hasTotal: true },
        { field: 'md2', displayName: 'مدين', visible: true, hasTotal: true },
      ],
    },
    {
      field: 'balance2',
      displayName: 'رصيد اخر فترة',
      hasSubHeaders: true,
      visible: true,
      hasTotal: true,
      subHeaders: [
        { field: 'dain3', displayName: 'دائن', visible: true, hasTotal: true },
        { field: 'md3', displayName: 'مدين', visible: true, hasTotal: true },
      ],
    },
  ];

  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getTrialBalanceReport(this.trialBalanceRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tableDataService.updateTableData(res);
          this.maxCount = this.apiService.getCurrentReportTotalCount;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  //declare request properties
  trialBalanceRequest!: ITrialBalanceRequest;
  time!: string;

  //declare page properties
  trialBalanceReport!: ITrialBalanceReport[];
  dateOptions!: IChipOption[];
  @ViewChild('modal') modal!: IonModal;
  loading: boolean = false;

  totalDain = 0;
  totalMd1 = 0;
  totalDain2 = 0;
  totalMd2 = 0;
  totalDain3 = 0;
  totalMd3 = 0;

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

  filterForm!: FormGroup;
  constructor(
    private timeService: TimeService,
    private apiService: APIService,
    private modalController: ModalController,
    private tableDataService: SharedTableDataService
  ) {
    this.tableDataService.setCurrentReportType('trialBalance');
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });
    this.tableDataService.setColumnDefs(this.columnDefs);
    /////
    this.filterForm = new FormGroup({
      isBeforeRelay: new FormControl(false),
      time: new FormControl('حتى يوم'),
      minTimeValue: new FormControl(this.timeService.getMinTimeValue()),
      maxTimeValue: new FormControl(this.timeService.getCurrentDate()),
      level: new FormControl('كافة المستويات', Validators.required),
    });
    //initialize page properties
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];
  }

  ngOnInit() {
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

  setDateOption($event: IChipOption) {
    this.filterForm.get('time')?.setValue($event.name);
    this.time = $event.name;
  }
  createRequestFilters() {
    this.trialBalanceRequest = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      Level: Number(this.allLevels[this.filterForm.get('level')?.value]),
    };
  }
  filterReport() {
    if (this.filterForm.invalid) {
      return;
    }

    this.modalController.dismiss();
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getTrialBalanceReport(this.trialBalanceRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.trialBalanceReport = data;
          this.maxCount = this.apiService.getCurrentReportTotalCount;
          this.tableDataService.setTableData(data);
          this.loading = false;
        },
        error: (error) => {
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
