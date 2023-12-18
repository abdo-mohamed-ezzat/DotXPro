import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { IonModal, ModalController } from '@ionic/angular';
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
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ICostCenter } from 'src/app/viewModels/icost-center';
import { IcustomerAndSuplier } from 'src/app/viewModels/icustomer-and-suplier';
import { Iitem } from 'src/app/viewModels/iitem';
import { ISalesProfitReport } from 'src/app/viewModels/isales-profit-report';
import { ISalesProfitRequest } from 'src/app/viewModels/isales-profit-request';

@Component({
  selector: 'app-sales-profit',
  templateUrl: './sales-profit.page.html',
  styleUrls: ['./sales-profit.page.scss'],
})
export class SalesProfitPage implements OnInit {
  //request values binding
  time!: string;
  itemName!: string;
  // typeOfReport!: string;
  // minTimeValue!: string;
  // maxTimeValue!: string;
  // supplierID!: number;
  costCenterName!: string;
  // categoryID!: number;
  // clientName!: string;

  filterForm!: FormGroup;
  

  //page data
  salesProfitReport!: ISalesProfitReport[];
  salesProfitRequest!: ISalesProfitRequest;
  dateOptions!: IChipOption[];
  allSuppliers!: IcustomerAndSuplier[];
  itemType!: string;
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  //filter items names
  searchItemName!: string;
  itemsNames!: Iitem[];
  filterdItemsNames!: Observable<Iitem[]>;
  itemsNamesCtrl!: FormControl;

  //forms values control
  customersNames!: IcustomerAndSuplier[];
  customerNameCtrl!: FormControl;
  filteredCustomerName!: Observable<IcustomerAndSuplier[]>;

  costCenters!: ICostCenter[];
  filterdCostCenters!: Observable<ICostCenter[]>;
  costCenterCtrl!: FormControl;

  constructor(
    private apiService: APIService,
    private timeService: TimeService,
    private modalController: ModalController
  ) {
    this.itemType = 'كافة الاصناف';


    // intialize form
    this.filterForm = new FormGroup({
      costCenterName: new FormControl('كافة المراكز', Validators.required),
      typeOfReport: new FormControl('تفصيلي', Validators.required),
      itemName: new FormControl('كافة الاصناف', Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(this.timeService.getMinTimeValue(), Validators.required),
      maxTimeValue: new FormControl(this.timeService.getCurrentDate(), Validators.required),
      supplierID: new FormControl(0, Validators.required),
      categoryID: new FormControl(0, Validators.required),
      clientName: new FormControl('كافة العملاء', Validators.required),
    })

    // intialize default values for page
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];

    
    // filter items names
    this.itemsNamesCtrl = new FormControl('');
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

    //filter customer name
    this.customersNames = [];
    this.apiService.getCustomerNames().subscribe((res) => {
      this.customersNames = res;
      this.allSuppliers = res;
    });
    this.customerNameCtrl = new FormControl('كافة العملاء', Validators.required);
    this.filteredCustomerName = this.customerNameCtrl.valueChanges.pipe(
      startWith(''),
      map((customerName) => {
        return customerName
          ? this.filterCustomersNames(customerName)
          : this.customersNames.slice();
      })
    );

    //filter cost centers
    this.costCenters = [];
    this.apiService.getAllCostCenters().subscribe((res) => {
      this.costCenters = res;
    });
    this.costCenterCtrl = new FormControl('كافة المراكز', Validators.required);
    this.filterdCostCenters = this.costCenterCtrl.valueChanges.pipe(
      startWith(''),
      map((res) => {
        return res ? this.filterCostCenters(res) : this.costCenters.slice();
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

  // filters methods
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

    return res.length ? res : [{ value: 'No name found', key: 0 }];
  }

  filterCostCenters(costCenterName: string): ICostCenter[] {
    let res = this.costCenters.filter(
      (name) =>
        name.accountName.toLowerCase().indexOf(costCenterName.toLowerCase()) ===
        0
    );
    return res.length
      ? res
      : [{ accountName: 'No centers found', accountNumber: 0, id: 0 }];
  }

  //set emited values
  setDateOption(option: IChipOption) {
    this.time = option.name;
    this.filterForm.get('time')?.setValue(option.name);
  }

  onTypeOfItemChange(event: Event) {
    const customEvent = event as CustomEvent;
    this.itemType = customEvent.detail.value;
    if (customEvent.detail.value === 'كافة الحسابات') {
      this.modal.present();
    }
    this.filterForm.get('itemName')?.setValue(customEvent.detail.value);
  }

  onItemSelected(event: MatAutocompleteSelectedEvent) {
    this.filterForm.get('itemName')?.setValue(event.option.value);
    this.modal.present();
  }

  //apply filters
  filterReport() {
    if(this.filterForm.invalid || this.customerNameCtrl.invalid || this.costCenterCtrl.invalid) {
      return;
    }
    if(this.itemsNamesCtrl.invalid ){
      this.modalController.dismiss();
      this.itemsNamesCtrl.setErrors({required: true});
      return;
    }
    this.loading = true;

    this.salesProfitRequest = {
      TypeOfReport: this.filterForm.get('typeOfReport')?.value,
      ItemName: this.filterForm.get('itemName')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      SupplierID: this.filterForm.get('supplierID')?.value,
      CategoryID: this.filterForm.get('categoryID')?.value,
      ClientName: this.customerNameCtrl.value,
      CostCenterName: this.costCenterCtrl.value,
    };
    if(this.filterForm.get('itemName')?.value !== 'كافة الاصناف') {
      this.filterForm.get('itemName')?.setValue('صنف واحد')
    }
    this.apiService.getSalesProfitReport(this.salesProfitRequest).subscribe({
      next: (res) => {
        this.loading = false;
        this.salesProfitReport = res;
      },
      error: (err) => {
        this.loading = false;        
      },
    });

    this.modalController.dismiss();
  }
}
