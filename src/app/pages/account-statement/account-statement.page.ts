import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { IAccountStatementReport } from 'src/app/viewModels/iaccount-statement-report';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ICostCenter } from 'src/app/viewModels/icost-center';
import { IAccount } from 'src/app/viewModels/iaccount';
import { ModalController } from '@ionic/angular';
import { Observable, Subject, map, of } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAccountStatementRequest } from 'src/app/viewModels/iaccount-statement-request';
import { TimeService } from 'src/app/services/time.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IonModal } from '@ionic/angular/common';
import { IOneAccountStatementReport } from '@app/viewModels/ione-account-statement-report';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.page.html',
  styleUrls: ['./account-statement.page.scss'],
})
export class AccountStatementPage implements OnInit {
  private destroy$ = new Subject<void>();
  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }

  getColumnDefs(typeOfReport: string): ColumnDef[] {
    let commonColumns: ColumnDef[];

    if (typeOfReport === 'كافة الحسابات') {
      commonColumns = [
        { displayName: 'مدين', field: 'madeen', visible: true, hasTotal: true },
        { displayName: 'دائن', field: 'dain', visible: true, hasTotal: true },
        {
          displayName: 'اسم الحساب',
          field: 'accountName',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'العملة',
          field: 'currencyName',
          visible: true,
          hasTotal: false,
        },
        // { displayName: 'الرقم', field: 'accountID', visible: true, hasTotal: false },
      ];
    } else {
      commonColumns = [
        { displayName: 'مدين', field: 'madeen', visible: true, hasTotal: true },
        { displayName: 'دائن', field: 'dain', visible: true, hasTotal: true },
        {
          displayName: 'الرصيد',
          field: 'blanace',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'حالتة',
          field: 'balanceState',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'المقابل',
          field: 'mcAmount',
          visible: true,
          hasTotal: true,
        },
        {
          displayName: 'العملة',
          field: 'currencyName',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'ملاحظات',
          field: 'notes',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'الرقم',
          field: 'recordNumber',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'التاريخ',
          field: 'theDate',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'المستند',
          field: 'documentName',
          visible: true,
          hasTotal: false,
        },
        {
          displayName: 'اسم الفرع',
          field: 'branchName',
          visible: true,
          hasTotal: false,
        },
      ];
    }

    return commonColumns.map((col) => ({ ...col }));
  }

  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    const result$ = this.apiService.getAccountStatementReport(
      this.accountStatementRequest
    );
    (result$ as Observable<IAccountStatementReport[]>)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tableDataService.updateTableData(res);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }
  //declare page properties
  accountStatementReport!: IAccountStatementReport[];
  accountStatementRequest!: IAccountStatementRequest;
  oneAccountstatementReport!: IOneAccountStatementReport[];
  loading = true;
  @ViewChild('modal') modal!: IonModal;
  totalMadeen!: number;
  totalDain!: number;
  totalBlanace = 0;
  totalMcAmount = 0;
  totalRecordNumber = 0;
  defaultCurrency!: string;
  dateOptions!: IChipOption[];
  accountsTypeOptions!: IChipOption[];
  currencyOptions!: IChipOption[];
  accounts!: IAccount[];
  filteredAccounts!: Observable<IAccount[]>;
  accountCtrl!: FormControl;

  costCenters!: ICostCenter[];
  filteredCostCenters!: Observable<ICostCenter[]>;
  costCentersCtrl!: FormControl;

  // declare request properties
  isBeforeRelay!: boolean;
  typeOfReport!: string;
  time!: string;
  filterForm!: FormGroup;

  constructor(
    private apiService: APIService,
    private modalController: ModalController,
    private timeSerivce: TimeService,
    private tableDataService: SharedTableDataService
  ) {
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });
    // intialize form
    this.accountStatementReport = [];
    this.filterForm = new FormGroup({
      isBeforeRelay: new FormControl(false, Validators.required),
      typeOfReport: new FormControl('كافة الحسابات', Validators.required),
      currency: new FormControl(this.defaultCurrency, Validators.required),
      costCenter: new FormControl('كافة المراكز', Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(
        this.timeSerivce.getMinTimeValue(),
        Validators.required
      ),
      maxTimeValue: new FormControl(
        this.timeSerivce.getCurrentDate(),
        Validators.required
      ),
    });

    // intialize filter options

    this.dateOptions = [
      { id: 1, name: 'خلال فترة', clicked: false },
      { id: 2, name: 'حتى يوم', clicked: true },
    ];

    this.loading = false;
    //lists controllers
    this.accounts = [];
    this.accountCtrl = new FormControl('كافة الحسابات', Validators.required);
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((account) => {
        return account ? this.filterAccounts(account) : this.accounts.slice();
      })
    );

    this.costCenters = [];
    this.costCentersCtrl = new FormControl('كافة المراكز', Validators.required);
    this.filteredCostCenters = this.costCentersCtrl.valueChanges.pipe(
      startWith(''),
      map((costCenter) => {
        return costCenter
          ? this.filterCostCenters(costCenter)
          : this.costCenters.slice();
      })
    );
    //intialize page properties
    this.typeOfReport = 'كافة الحسابات';

  }

  ngOnInit() {
    this.tableDataService.setColumnDefs(this.getColumnDefs('كافة الحسابات'));

    this.apiService
      .getAllAccountsNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.accounts = res;
      });

    this.apiService
      .getAllCostCenters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.costCenters = res;
      });
    this.filterForm
      .get('minTimeValue')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {});
    this.filterForm
      .get('typeOfReport')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.tableDataService.setColumnDefs(this.getColumnDefs(value));
      });
    this.currencyOptions = [];
    this.apiService
      .getAllCurrencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currencies) => {
          currencies.forEach((currency) => {
            if (currency.key == 1) {
              this.defaultCurrency = currency.value;
              this.currencyOptions.push({
                id: 1,
                name: currency.value,
                clicked: true,
              });
            } else {
              this.currencyOptions.push({
                id: currency.key,
                name: currency.value,
                clicked: false,
              });
            }
          });
        },
      });
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  //set emited values
  setDateOption(option: IChipOption) {
    this.filterForm.get('time')?.setValue(option.name);
    this.time = option.name;
  }

  setCurrenyValueOption(option: IChipOption) {
    this.filterForm.get('currency')?.setValue(option.name);
  }

  setCostCenterValueOption(option: IChipOption) {
    this.filterForm.get('costCenter')?.setValue(option.name);
  }
  setOneAccountValueOption(event: MatAutocompleteSelectedEvent) {
    this.typeOfReport = event.option.value;
    this.filterForm.get('typeOfReport')?.setValue(event.option.value);
  }


  //filters
  filterAccounts(accountName: string): IAccount[] {
    let res = this.accounts.filter((account) => {
      return (
        account.accountName.includes(accountName) ||
        account.accountNumber.toString().includes(accountName)
      );
    });
    return res;
  }

  filterCostCenters(costCenterName: string): ICostCenter[] {
    let res = this.costCenters.filter((costCenter) => {
      return (
        costCenter.accountName.includes(costCenterName) ||
        costCenter.accountNumber.toString().includes(costCenterName)
      );
    });
    return res;
  }

  createRequestFilters() {


    this.accountStatementRequest = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      TypeOfReport:
        this.filterForm.get('typeOfReport')?.value || this.accountCtrl.value,
      Currency: this.filterForm.get('currency')?.value,
      CostCenter: this.costCentersCtrl.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
  }

  applyFilters() {
    const currencyControl = this.filterForm.get('currency');
    if (currencyControl && !currencyControl?.value) {
      currencyControl.setValue(this.defaultCurrency);
    }
    if (this.filterForm.invalid) {
      return;
    }
    if (this.costCentersCtrl.invalid) {
      this.costCentersCtrl.setErrors({ invalid: true });
      this.modal.dismiss();
      return;
    }

    this.modalController.dismiss();
    this.loading = true;
    this.createRequestFilters();
    const result$ = this.apiService.getAccountStatementReport(
      this.accountStatementRequest
    );
    if (this.accountStatementRequest.TypeOfReport === 'كافة الحسابات') {
      (result$ as Observable<IAccountStatementReport[]>)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.tableDataService.setTableData(res);
            this.maxCount = this.apiService.getCurrentReportTotalCount;
            this.accountStatementReport = res;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
    } else {
      (result$ as Observable<IOneAccountStatementReport[]>)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.tableDataService.setTableData(res);
            this.oneAccountstatementReport = res;
            this.maxCount = this.apiService.getCurrentReportTotalCount;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
    }
  }

  ngOnDestroy() {
    this.tableDataService.deleteTableColumns();
    this.tableDataService.deleteTableData();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
