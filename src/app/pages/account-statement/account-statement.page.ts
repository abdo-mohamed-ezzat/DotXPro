import { Component, OnInit, ViewChild } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { IAccountStatementReport } from 'src/app/viewModels/iaccount-statement-report';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ICostCenter } from 'src/app/viewModels/icost-center';
import { IAccount } from 'src/app/viewModels/iaccount';
import { ModalController } from '@ionic/angular';
import { Observable, map, of } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAccountStatementRequest } from 'src/app/viewModels/iaccount-statement-request';
import { TimeService } from 'src/app/services/time.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IonModal } from '@ionic/angular/common';
import { IOneAccountStatementReport } from '@app/viewModels/ione-account-statement-report';
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.page.html',
  styleUrls: ['./account-statement.page.scss'],
})
export class AccountStatementPage implements OnInit {
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
  dateOptions!: IChipOption[];
  accountsTypeOptions!: IChipOption[];
  currencyOptions!: IChipOption[];
  costCentersOptions!: IChipOption[];
  layoutOptions!: IChipOption[];

  accounts!: IAccount[];
  filteredAccounts!: Observable<IAccount[]>;
  accountCtrl!: FormControl;
  searchAccountName!: string;

  costCenters!: ICostCenter[];
  filteredCostCenters!: Observable<ICostCenter[]>;
  costCentersCtrl!: FormControl;
  searchCostCenterName!: string;

  // declare request properties
  isBeforeRelay!: boolean;
  typeOfReport!: string;
  currency!: string;
  costCenter!: string;
  time!: string;
  minTimeValue!: string;
  maxTimeValue!: string;

  // declare form
  filterForm!: FormGroup;

  constructor(
    private apiService: APIService,
    private modalController: ModalController,
    private timeSerivce: TimeService
  ) {
    this.accountStatementReport = [];
    // intialize form
    this.filterForm = new FormGroup({
      isBeforeRelay: new FormControl(false, Validators.required),
      typeOfReport: new FormControl('كافة الحسابات', Validators.required),
      currency: new FormControl('كافة العملات', Validators.required),
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
    this.layoutOptions = [
      { id: 1, name: 'قبل الترحيل', clicked: true },
      { id: 2, name: 'بعد الترحيل', clicked: false },
    ];
    this.dateOptions = [
      { id: 1, name: 'خلال فترة', clicked: false },
      { id: 2, name: 'حتى يوم', clicked: true },
    ];
    this.accountsTypeOptions = [
      {
        id: 1,
        name: 'كشف كافة الحسابات',
        clicked: true,
      },
    ];
    this.currencyOptions = [
      { id: 1, name: 'كافة العملات', clicked: true },
      { id: 2, name: 'ريال سعودي', clicked: false },
      { id: 3, name: 'جنيه مصري', clicked: false },
    ];
    this.costCentersOptions = [
      { id: 1, name: 'كافة المراكز', clicked: true },
      { id: 2, name: 'المركز الرئيسى', clicked: false },
    ];
    this.loading = false;
    //lists controllers
    this.accounts = [];
    this.accountCtrl = new FormControl('', Validators.required);
    this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
      startWith(''),
      map((account) => {
        return account ? this.filterAccounts(account) : this.accounts.slice();
      })
    );

    this.costCenters = [];
    this.costCentersCtrl = new FormControl('كافة المراكز', Validators.required);
    this.filteredCostCenters = this.costCentersCtrl.valueChanges.pipe(
      startWith('كافة المراكز'),
      map((costCenter) => {
        return costCenter
          ? this.filterCostCenters(costCenter)
          : this.costCenters.slice();
      })
    );
    //intialize page properties
    this.typeOfReport = 'كافة الحسابات';
    this.totalMadeen = 0;
    this.totalDain = 0;
  }

  ngOnInit() {
    this.apiService.getAllAccountsNames().subscribe((res) => {
      this.accounts = res;
    });

    this.apiService.getAllCostCenters().subscribe((res) => {
      this.costCenters = res;
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
  setRelayoption(option: IChipOption) {
    this.isBeforeRelay = option.name === 'قبل الترحيل' ? true : false;
    this.filterForm.get('isBeforeRelay')?.setValue(this.isBeforeRelay);
  }

  setCurrenyValueOption(option: IChipOption) {
    this.filterForm.get('currency')?.setValue(option.name);
  }

  setCostCenterValueOption(option: IChipOption) {
    this.filterForm.get('costCenter')?.setValue(option.name);
  }
  setOneAccountValueOption(event: MatAutocompleteSelectedEvent) {
    this.filterForm.get('typeOfReport')?.setValue(event.option.value);
    this.modal.present();
  }

  onTypeOfReportChange(event: Event) {
    const customEvent = event as CustomEvent;
    if (customEvent.detail.value === 'كافة الحسابات') {
      this.filterForm.get('typeOfReport')?.setValue('كافة الحسابات');
      this.accountCtrl.setValue('كافة الحسابات');
      this.modal.present();
    }
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

  applyFilters() {
    this.totalMadeen = 0;
    this.totalDain = 0;
    this.totalBlanace = 0;
    this.totalMcAmount = 0;
    this.totalRecordNumber = 0;
    if (this.filterForm.invalid) {
      return;
    }
    if (this.costCentersCtrl.invalid) {
      this.costCentersCtrl.setErrors({ invalid: true });
      this.modal.dismiss();
      return;
    }
    console.log(this.filterForm.value);
    this.modalController.dismiss();
    this.loading = true;
    this.accountStatementRequest = {
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      TypeOfReport:
        this.filterForm.get('typeOfReport')?.value || this.accountCtrl.value,
      Currency: this.filterForm.get('currency')?.value,
      CostCenter: this.filterForm.get('costCenter')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
    const result$ = this.apiService.getAccountStatementReport(
      this.accountStatementRequest
    );

    if (this.accountStatementRequest.TypeOfReport === 'كافة الحسابات') {
      (result$ as Observable<IAccountStatementReport[]>).subscribe(
        (res) => {
          console.log(res);
          this.accountStatementReport = res;
          this.accountStatementReport.forEach((report) => {
            this.totalMadeen += report.madeen;
            this.totalDain += report.dain;
          });
          this.loading = false;
        },
        (err) => {
          this.loading = false;
        }
      );
    } else {
      (result$ as Observable<IOneAccountStatementReport[]>).subscribe({
        next: (res) => {
          console.log(res);
          this.oneAccountstatementReport = res;
          this.oneAccountstatementReport.forEach((report) => {
            this.totalMadeen += report.madeen;
            this.totalDain += report.dain;
            this.totalBlanace += report.blanace;
            this.totalMcAmount += report.mcAmount;
            this.totalRecordNumber += report.recordNumber;
          });
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });
    }
  }
}
