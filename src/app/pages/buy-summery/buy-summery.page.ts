import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IBuySummeryReport } from 'src/app/viewModels/ibuy-summery-report';
import { IBuySummeryRequest } from 'src/app/viewModels/ibuy-summery-request';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { Iitem } from 'src/app/viewModels/iitem';
import { IPaymentMethod } from 'src/app/viewModels/ipayment-method';

@Component({
  selector: 'app-buy-summery',
  templateUrl: './buy-summery.page.html',
  styleUrls: ['./buy-summery.page.scss'],
})
export class BuySummeryPage implements OnInit {
  //declare page properties
  buySummeryReport!: IBuySummeryReport[];
  buySummeryRequest!: IBuySummeryRequest;
  itemType!: string;
  dateOptions!: IChipOption[];
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  
  //filter items names
  typeOfReport!: string;
  itemName!: string;
  time!: string;
  
  
  itemsNames!: Iitem[];
  filterdItemsNames!: Observable<Iitem[]>;
  itemsNamesCtrl!: FormControl;
  searchItemName!: string;
  
  paymentTypes!: IPaymentMethod[];
  filteredPaymentType!: Observable<IPaymentMethod[]>;
  paymentTypeCtrl!: FormControl;

  filterForm!: FormGroup;
  constructor(
    private apiService: APIService,
    private timeService: TimeService,

  ) {
    //initialize form
    this.filterForm = new FormGroup({
      typeOfReport: new FormControl('تفصيلي', Validators.required),
      itemName: new FormControl('كافة الاصناف', Validators.required),
      supplierID: new FormControl(0, Validators.required),
      theMethodName: new FormControl('الكل', Validators.required),
      categoryID: new FormControl(0, Validators.required),
      isRedoneConnectedToBuy: new FormControl(false, Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(
        this.timeService.getMinTimeValue(),
        Validators.required
      ),
      maxTimeValue: new FormControl(
        this.timeService.getCurrentDate(),
        Validators.required
      ),
      
    })
    //intialize page properties
    this.itemType = 'كافة الاصناف';
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];
    this.paymentTypes = [];
    this.itemsNames = [];
  }

  ngOnInit() {
    // lists contorls
    this.apiService.getPaymentMethod().subscribe((res) => {
      this.paymentTypes = res;
    });
    this.paymentTypeCtrl = new FormControl('الكل');
    this.filteredPaymentType = this.paymentTypeCtrl.valueChanges.pipe(
      startWith(''),
      map((paymentType) => {
        return paymentType
          ? this.filterPaymentType(paymentType)
          : this.paymentTypes.slice();
      })
    );

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
  }

  //filteration functions
  filterPaymentType(name: string): IPaymentMethod[] {
    let res = this.paymentTypes.filter(
      (payment) => payment.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );

    return res;
  }

  filterItemsNames(name: string): Observable<Iitem[]> {
    const filterValue = name.toLowerCase();
    return this.apiService
      .getFilteredItems(filterValue, this.itemsNames)
      .pipe(map((item) => item));
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  // handle table headers
  getColumnHeaders(): string[] {
    if (this.filterForm.get('typeOfReport')?.value === 'اجمالي') {
      return [
        'المورد',
        'التاريخ',
        'الدفع',
        'العملة',
        'اجمالى المشتريات',
        'اجمالى المردود',
        'صافى المشتريات',
        'صافى المشتربات بالمقابل',
        'صافى الضريبة',
      ];
    } else {
      return [
        'المورد',
        'التاريخ',
        'رقم الفاتورة',
        'الدفع',
        'العملة',
        'صافى مبلغ الفاتورة',
        'صافي مبلغ المردود',
        'صافي المشتريات',
        'صافي المشتريات بالمقابل',
        'صافى الضريبة',
      ];
    }
  }

  // set emited values
  onTypeOfItemChange(event: Event) {
    const customEvent = event as CustomEvent;
    this.itemType = customEvent.detail.value;
    if (customEvent.detail.value === 'كافة الاصناف') {
      this.filterForm.get('itemName')?.setValue('كافة الاصناف');
      this.modal.present();
    }
    this.itemType = customEvent.detail.value;
    console.log(this.itemType);
  }
  setDateOption(event: IChipOption) {
    this.filterForm.get('time')?.setValue(event.name);
    this.time = event.name;
  }
  onItemSelected(event: MatAutocompleteSelectedEvent) {
    this.itemName = event.option.value;
    this.filterForm.get('itemName')?.setValue(event.option.value);
    this.modal.present();
  }

  // apply filters
  filterReport() {
    if(this.filterForm.invalid || this.paymentTypeCtrl.invalid) {
      return;
    }
    if(this.itemsNamesCtrl.invalid ){
      this.modal.dismiss();
      this.itemsNamesCtrl.setErrors({required: true});
      return;
    }

    if(this.itemType == 'كافة الاصناف'){
      this.filterForm.get('itemName')?.setValue('كافة الاصناف');
    }
    this.modal.dismiss();
    this.loading = true;
    this.buySummeryRequest = {
      TypeOfReport: this.filterForm.get('typeOfReport')?.value,
      ItemName: this.filterForm.get('itemName')?.value,
      SupplierID: this.filterForm.get('supplierID')?.value,
      TheMethodName: this.filterForm.get('theMethodName')?.value,
      CategoryID: this.filterForm.get('categoryID')?.value,
      IsRedoneConnectedToBuy: this.filterForm.get('isRedoneConnectedToBuy')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
    this.apiService.getBuySummeryReport(this.buySummeryRequest).subscribe({
      next: (res) => {
        this.buySummeryReport = res;
        console.log(this.buySummeryReport);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
