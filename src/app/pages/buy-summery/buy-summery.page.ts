import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { ICategory } from '@app/viewModels/icategory';
import { ISupplier } from '@app/viewModels/isupplier';
import { IonModal } from '@ionic/angular/common';
import {
  Observable,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IBuySummeryReport } from 'src/app/viewModels/ibuy-summery-report';
import { IBuySummeryRequest } from 'src/app/viewModels/ibuy-summery-request';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { Iitem } from 'src/app/viewModels/iitem';
import { IPaymentMethod } from 'src/app/viewModels/ipayment-method';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buy-summery',
  templateUrl: './buy-summery.page.html',
  styleUrls: ['./buy-summery.page.scss'],
})
export class BuySummeryPage implements OnInit {
  getColumnDefs(typeOfReport: string): ColumnDef[] {
    const commonColumns: ColumnDef[] = [
      {
        displayName: 'المورد',
        field: 'clientName',
        visible: true,
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
        displayName: 'اجمالى المشتريات',
        field: 'totalBuy',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'اجمالى المردود',
        field: 'totalRedone',
        visible: typeOfReport === 'اجمالي' || typeOfReport == 'تفصيلي',
        hasTotal: true,
      },
      {
        displayName: 'صافى المشتريات',
        field: 'totalNet',
        visible: true,
        hasTotal: true,
      },
      // {
      //   displayName: 'صافى المشتربات بالمقابل',
      //   field: 'totalMcNet',
      //   visible: true,
      //   hasTotal: true,
      // },
      {
        displayName: 'صافى الضريبة',
        field: 'totalNetTaxValue',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'التاريخ',
        field: 'theDate',
        visible: true,
        hasTotal: false,
      },
    ];

    return commonColumns;
  }

  private destroy$ = new Subject<void>();
  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }

  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getBuySummeryReport(this.buySummeryRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.tableDataService.updateTableData(res);
        },
      });
  }

  //declare page properties
  buySummeryReport!: IBuySummeryReport[];
  buySummeryRequest!: IBuySummeryRequest;
  itemType!: string;
  dateOptions!: IChipOption[];
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  totalBuy = 0;
  totalRedone = 0;
  totalNet = 0;
  totalMcNet = 0;
  totalNetTaxValue = 0;
  pageNumber: number = 1;
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

  suplliers!: ISupplier[];
  filteredSuppliers!: Observable<ISupplier[]>;
  suppliersCtrl!: FormControl;

  categories!: ICategory[];
  filteredCategories!: Observable<ICategory[]>;
  categoriesCtrl!: FormControl;

  filterForm!: FormGroup;
  constructor(
    private apiService: APIService,
    public timeService: TimeService,
    private tableDataService: SharedTableDataService
  ) {
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });
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
    });
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
    this.tableDataService.setColumnDefs(this.getColumnDefs('تفصيلي'));
    this.filterForm
      .get('typeOfReport')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.tableDataService.setColumnDefs(this.getColumnDefs(value));
      });
    // lists contorls
    this.apiService
      .getPaymentMethod()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
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

    //filter suppliers
    this.apiService
      .getCustomerNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.suplliers = res;
      });
    this.suppliersCtrl = new FormControl('كافة الموردين', Validators.required);
    this.filteredSuppliers = this.suppliersCtrl.valueChanges.pipe(
      startWith(''),
      map((supplier) => {
        return supplier
          ? this.filterSuppliers(supplier)
          : this.suplliers.slice();
      })
    );

    //filter categories
    this.apiService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.categories = res;
      });
    this.categoriesCtrl = new FormControl(
      'كافة المجموعات',
      Validators.required
    );
    this.filteredCategories = this.categoriesCtrl.valueChanges.pipe(
      startWith(''),
      map((category) => {
        return category
          ? this.filterCategories(category)
          : this.categories.slice();
      })
    );
  }

  //filteration functions
  filterPaymentType(name: string): IPaymentMethod[] {
    let res = this.paymentTypes.filter(
      (payment) => payment.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );

    return res;
  }

  filterSuppliers(name: string): ISupplier[] {
    let res = this.suplliers.filter(
      (supplier) =>
        supplier.value.toLowerCase().indexOf(name.toLowerCase()) === 0
    );

    return res;
  }

  filterItemsNames(name: string): Observable<Iitem[]> {
    const filterValue = name.toLowerCase();
    return this.apiService
      .getFilteredItems(filterValue, this.itemsNames)
      .pipe(map((item) => item));
  }

  filterCategories(name: string): ICategory[] {
    let res = this.categories.filter(
      (category) =>
        category.value.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
    return res;
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  // set emited values
  // onTypeOfItemChange(event: Event) {
  //   const customEvent = event as CustomEvent;
  //   this.itemType = customEvent.detail.value;
  //   if (customEvent.detail.value === 'كافة الاصناف') {
  //     this.filterForm.get('itemName')?.setValue('كافة الاصناف');
  //     this.modal.present();
  //   }
  //   this.itemType = customEvent.detail.value;
  //   console.log(this.itemType);
  // }
  setDateOption(event: IChipOption) {
    this.filterForm.get('time')?.setValue(event.name);
    this.time = event.name;
  }
  onItemSelected(event: MatAutocompleteSelectedEvent) {
    this.itemName = event.option.value;
    this.filterForm.get('itemName')?.setValue(event.option.value);
    this.tableDataService.setColumnDefs(this.getColumnDefs(this.itemName));
  }

  // apply filters

  createRequestFilters() {
    let supplierValue = this.suppliersCtrl.value;
    let matchingSupplier = this.suplliers.find(
      (supplier) => supplier.value === supplierValue
    );
    let supplierID = matchingSupplier ? matchingSupplier.key : 0;
    let categoryValue = this.categoriesCtrl.value;
    let matchingCategory = this.categories.find(
      (category) => category.value === categoryValue
    );
    let categoryID = matchingCategory ? matchingCategory.key : 0;

    if (this.itemType == 'كافة الاصناف') {
      this.filterForm.get('itemName')?.setValue('كافة الاصناف');
    }

    this.buySummeryRequest = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      TypeOfReport: this.filterForm.get('typeOfReport')?.value,
      ItemName: this.filterForm.get('itemName')?.value,
      SupplierID: supplierID,
      TheMethodName: this.paymentTypeCtrl.value,
      CategoryID: categoryID,
      IsRedoneConnectedToBuy: this.filterForm.get('isRedoneConnectedToBuy')
        ?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
  }

  filterReport() {
    if (
      this.filterForm.invalid ||
      this.paymentTypeCtrl.invalid ||
      this.suppliersCtrl.invalid ||
      this.categoriesCtrl.invalid
    ) {
      return;
    }
    if (this.itemsNamesCtrl.invalid) {
      this.modal.dismiss();
      this.itemsNamesCtrl.setErrors({ required: true });
      return;
    }

    if (this.itemType == 'كافة الاصناف') {
      this.filterForm.get('itemName')?.setValue('كافة الاصناف');
    }

    this.modal.dismiss();
    this.loading = true;
    this.createRequestFilters();
    this.apiService
      .getBuySummeryReport(this.buySummeryRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.buySummeryReport = res;
          this.tableDataService.setTableData(res);
          this.maxCount = this.apiService.getCurrentReportTotalCount;
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
