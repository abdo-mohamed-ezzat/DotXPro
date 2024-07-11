import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, map, of, startWith } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { IcustomerAndSuplier } from 'src/app/viewModels/icustomer-and-suplier';
import { Iitem } from 'src/app/viewModels/iitem';
import { IPaymentMethod } from 'src/app/viewModels/ipayment-method';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { ISalesSummeryRequest } from '../../viewModels/isales-summery-request';
import { TimeService } from 'src/app/services/time.service';
import { ISalesSummeryReport } from 'src/app/viewModels/isales-summery-report';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ModalController, RadioGroupChangeEventDetail } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { IonRadioGroupCustomEvent } from '@ionic/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-net-sales',
  templateUrl: './net-sales.page.html',
  styleUrls: ['./net-sales.page.scss'],
})
export class NetSalesPage {
  private destroy$ = new Subject<void>();
  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }

  getColumnDefs(typeOfReport: string): ColumnDef[] {
    const commonColumns: ColumnDef[] = [
      {
        displayName: 'النوع',
        field: 'docType',
        visible: true,
        hasTotal: false,
      },
      // {
      //   displayName: 'رقم العميل',
      //   field: 'theNumber',
      //   visible: typeOfReport != 'اجمالي عام',
      //   hasTotal: false,
      // },
      {
        displayName: 'العميل',
        field: 'clientName',
        visible: typeOfReport != 'اجمالي عام' ,
        hasTotal: false,
      },
      {
        displayName: 'رقم الفاتورة',
        field: 'recordNumber',
        visible: typeOfReport === 'تفصيلي',
        hasTotal: false,
      },

      {
        displayName: 'الدفع',
        field: 'theMethod',
        visible: true,
        hasTotal: false,
      },
      {
        displayName: 'العملة',
        field: 'currencyName',
        visible: true,
        hasTotal: false,
      },
      {
        displayName: 'الموزع',
        field: 'distributorName',
        visible: typeOfReport != 'اجمالي عام',
        hasTotal: false,
      },
      {
        displayName:'اجمالي المبيعات',
        field: 'صافي_مبلغ_الفاتورة',
        visible: true,
        hasTotal: true,
      },
      {
        displayName:'اجمالي المردود',
        field: 'صافي_مبلغ_المردود',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'صافي المبيعات',
        field: 'صافي_المبيعات',
        visible: true,
        hasTotal: true,
      },
      // {
      //   displayName: 'صافي المبيعات بالمحلي',
      //   field: 'صافي_المبيعات_بالمحلي',
      //   visible: true,
      //   hasTotal: true,
      // },
      {
        displayName: 'صافي الضريبة',
        field: 'صافي_الضريبة',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'الإجمالي مع الضريبة',
        field: 'الإجمالي_مع_الضريبة',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'التاريخ',
        field: 'theDate',
        visible: typeOfReport != 'اجمالي عام',
        hasTotal: false,
      },
    ];

    return commonColumns;
  }

  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getSalesSummeryReport(this.reportRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.tableDataService.updateTableData(res);
        },
      });
  }
  //////////
  reportRequest!: ISalesSummeryRequest;
  salesSummeryreport!: ISalesSummeryReport[];

  time!: string;
  itemName!: string;
  typeOfReport!: string;

  filterForm!: FormGroup;

  itemsNames!: Iitem[];
  filterdItemsNames!: Observable<Iitem[]>;
  itemsNamesCtrl: FormControl;

  customersNames!: IcustomerAndSuplier[];
  filteredCustomerName!: Observable<IcustomerAndSuplier[]>;
  customerNameCtrl!: FormControl;

  paymentTypes!: IPaymentMethod[];
  filteredPaymentType!: Observable<IPaymentMethod[]>;
  paymentTypeCtrl!: FormControl;

  dateOptions!: IChipOption[];
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;

  constructor(
    private apiService: APIService,
    private timeService: TimeService,
    private modalcontroller: ModalController,
    private tableDataService: SharedTableDataService
  ) {
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });
    this.loading = false;
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];

    // intialize form
    this.filterForm = new FormGroup({
      itemName: new FormControl('كافة الاصناف', Validators.required),
      typeOfReport: new FormControl('اجمالي', Validators.required),
      theMethodName: new FormControl('الكل', Validators.required),
      clientName: new FormControl('كافة العملاء', Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(this.timeService.getMinTimeValue()),
      maxTimeValue: new FormControl(this.timeService.getCurrentDate()),
    });

    this.itemName = 'كافة الاصناف';
    // lists controllers
    this.itemsNames = [];
    this.apiService
      .getitemName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.itemsNames = res;
      });
    this.itemsNamesCtrl = new FormControl('كافة الاصناف');
    this.filterdItemsNames = this.itemsNamesCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((itemName) =>
        itemName ? this.filterItemsNames(itemName) : of(this.itemsNames.slice())
      )
    );

    this.customersNames = [{ value: 'كافة العملاء', key: 0 }];
    this.apiService
      .getCustomerNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.customersNames = res;
      });
    this.customerNameCtrl = new FormControl(
      'كافة العملاء',
      Validators.required
    );
    this.filteredCustomerName = this.customerNameCtrl.valueChanges.pipe(
      startWith(''),
      map((customer) =>
        customer
          ? this.filterCustomersNames(customer)
          : this.customersNames.slice()
      )
    );

    this.paymentTypes = [{ name: 'الكل', id: 0 }];
    this.apiService
      .getPaymentMethod()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.paymentTypes = res;
      });
    this.paymentTypeCtrl = new FormControl('الكل', Validators.required);
    this.filteredPaymentType = this.paymentTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((paymentType) => {
        return paymentType
          ? this.filterPaymentType(paymentType)
          : this.paymentTypes.slice();
      })
    );
  }

  ngOnInit() {
    this.tableDataService.setColumnDefs(this.getColumnDefs('اجمالي'));

    this.filterForm
      .get('typeOfReport')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.tableDataService.setColumnDefs(this.getColumnDefs(value));
      });
  }

  ngAfterViewInit() {
    this.loading = true;
    setTimeout(() => {
      this.modal.present();
      this.loading = false;
    }, 2000);
  }

  setOneItemValueOption($event: MatAutocompleteSelectedEvent) {
    this.filterForm.get('itemName')?.setValue($event.option.value);
    this.itemsNamesCtrl.value.setValue($event.option.value);
    this.modal.present();
  }

  // onTypeOfItemChanged(
  //   $event: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<any>>
  // ) {
  //   this.itemName = $event.detail.value;
  //   if ($event.detail.value === 'كافة الاصناف') {
  //     this.filterForm.get('itemName')?.setValue('كافة الاصناف');
  //     this.itemsNamesCtrl.setValue('كافة الاصناف');
  //     this.modal.present();
  //   }
  // }

  filterItemsNames(name: string): Observable<Iitem[]> {
    const filterValue = name.toLowerCase();
    return this.apiService
      .getFilteredItems(filterValue, this.itemsNames)
      .pipe(map((item) => item));
  }

  filterCustomersNames(name: string): IcustomerAndSuplier[] {
    let res = this.customersNames.filter(
      (customer) =>
        customer.value.toLowerCase().indexOf(name.toLowerCase()) === 0
    );

    return res;
  }

  filterPaymentType(name: string): IPaymentMethod[] {
    let res = this.paymentTypes.filter(
      (payment) => payment.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );

    return res;
  }
  // set emited values
  setDateOption(option: IChipOption) {
    console.log(option);
    this.time = option.name;
    this.filterForm.get('time')?.setValue(option.name);
  }
  createRequestFilters() {
    this.reportRequest = {
      PageSize: this.pageSize,
      PageNumber: this.pageIndex,
      TypeOfReport: this.filterForm.get('typeOfReport')?.value,
      ItemName: this.itemsNamesCtrl.value || 'كافة الاصناف',
      ClientName: this.customerNameCtrl.value,
      TheMethodName: this.paymentTypeCtrl.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
  }
  filterReport() {
    if (this.filterForm.invalid) {
      return;
    }

    this.modalcontroller.dismiss();
    this.loading = true;

    this.createRequestFilters();
    this.apiService
      .getSalesSummeryReport(this.reportRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tableDataService.setTableData(res);
          this.maxCount = this.apiService.getCurrentReportTotalCount;
          // this.salesSummeryreport = res;

          this.loading = false;
        },
        error: (err) => {
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
