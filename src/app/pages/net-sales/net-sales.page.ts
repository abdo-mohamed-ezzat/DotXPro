import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, of, startWith } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { IcustomerAndSuplier } from 'src/app/viewModels/icustomer-and-suplier';
import { Iitem } from 'src/app/viewModels/iitem';
import { IPaymentMethod } from 'src/app/viewModels/ipayment-method';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ISalesSummeryRequest } from '../../viewModels/isales-summery-request';
import { TimeService } from 'src/app/services/time.service';
import { ISalesSummeryReport } from 'src/app/viewModels/isales-summery-report';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ModalController, RadioGroupChangeEventDetail } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { IonRadioGroupCustomEvent } from '@ionic/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-net-sales',
  templateUrl: './net-sales.page.html',
  styleUrls: ['./net-sales.page.scss'],
})
export class NetSalesPage {
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
  totalWithTax = 0;
  totalSales = 0;
  totalReturns = 0;
  totalTax = 0;
  totalNetSales = 0;
  totalLocalNetSales = 0;
  constructor(
    private apiService: APIService,
    private timeService: TimeService,
    private modalcontroller: ModalController
  ) {
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
    this.apiService.getitemName().subscribe((res) => {
      this.itemsNames = res;
    });
    this.itemsNamesCtrl = new FormControl('');
    this.filterdItemsNames = this.itemsNamesCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((itemName) =>
        itemName ? this.filterItemsNames(itemName) : of(this.itemsNames.slice())
      )
    );

    this.customersNames = [{ value: 'كافة العملاء', key: 0 }];
    this.apiService.getCustomerNames().subscribe((res) => {
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
    this.apiService.getPaymentMethod().subscribe((res) => {
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

  ngOnInit() {}

  ngAfterViewInit() {
    this.loading = true;
    setTimeout(() => {
      this.modal.present();
      this.loading = false;
    }, 2000);
  }

  setOneItemValueOption($event: MatAutocompleteSelectedEvent) {
    this.filterForm.get('itemName')?.setValue($event.option.value);
    this.modal.present();
  }

  onTypeOfItemChanged(
    $event: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<any>>
  ) {
    this.itemName = $event.detail.value;
    if ($event.detail.value === 'كافة الاصناف') {
      this.filterForm.get('itemName')?.setValue('كافة الاصناف');
      this.itemsNamesCtrl.setValue('كافة الاصناف');
      this.modal.present();
    }
  }
  onTypeOfReportChanged(
    $event: IonRadioGroupCustomEvent<RadioGroupChangeEventDetail<any>>
  ) {
    this.filterForm.get('typeOfReport')?.setValue($event.detail.value);
  }

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

  filterReport() {
    if (this.filterForm.invalid) {
      return;
    }

    this.modalcontroller.dismiss();
    this.loading = true;

    this.reportRequest = {
      TypeOfReport: this.filterForm.get('typeOfReport')?.value,
      ItemName: this.itemsNamesCtrl.value || 'كافة الاصناف',
      ClientName: this.customerNameCtrl.value,
      TheMethodName: this.paymentTypeCtrl.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
    console.log(this.reportRequest);
    this.apiService.getSalesSummeryReport(this.reportRequest).subscribe({
      next: (res) => {
        this.salesSummeryreport = res;
        console.log(this.salesSummeryreport);
        this.salesSummeryreport.forEach(account => {
          this.totalWithTax += account['الإجمالي_مع_الضريبة'];
          this.totalSales += account['المبيعات'];
          this.totalReturns += account['المردود'];
          this.totalTax += account['صافي_الضريبة'];
          this.totalNetSales += account['صافي_المبيعات'];
          this.totalLocalNetSales += account['صافي_المبيعات_بالمحلي'];
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
