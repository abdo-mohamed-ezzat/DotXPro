import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { ICategory } from '@app/viewModels/icategory';
import { ISupplier } from '@app/viewModels/isupplier';
import { IonModal, ModalController } from '@ionic/angular';
import {
  EMPTY,
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  startWith,
  switchMap,
  tap,
  takeUntil,
  Subject,
} from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ICostCenter } from 'src/app/viewModels/icost-center';
import { IcustomerAndSuplier } from 'src/app/viewModels/icustomer-and-suplier';
import { Iitem } from 'src/app/viewModels/iitem';
import { ISalesProfitReport } from 'src/app/viewModels/isales-profit-report';
import { ISalesProfitRequest } from 'src/app/viewModels/isales-profit-request';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sales-profit',
  templateUrl: './sales-profit.page.html',
  styleUrls: ['./sales-profit.page.scss'],
})
export class SalesProfitPage implements OnInit {
  private destroy$ = new Subject<void>();
  submit() {
    this.tableDataService.deleteTableData();
    this.tableDataService.setCurrentPageIndex(1);
  }

  getColumnDefs(typeOfReport: string): ColumnDef[] {
    const columnDefs: ColumnDef[] = [
      {
        displayName: 'المستند',
        field: 'documentName',
        visible: typeOfReport === 'تفصيلي' || typeOfReport === 'تجميع بالمستند',
        hasTotal: false,
      },
      // {
      //   displayName: 'نوع المستند',
      //   field: 'documentType',
      //   visible: true,
      //   hasTotal: false,
      // },
      {
        displayName: 'رقم.ف',
        field: 'recordNumber',
        visible: typeOfReport === 'تفصيلي' || typeOfReport === 'تجميع بالمستند',
        hasTotal: false,
      },
      {
        displayName: 'العميل',
        field: 'clientName',
        visible: typeOfReport === 'تفصيلي' || typeOfReport === 'تجميع بالعميل',
        hasTotal: false,
      },
      {
        displayName: 'رقم العميل',
        field: 'clientNumber',
        visible:  typeOfReport === 'تجميع بالعميل',
        hasTotal: false,
      },
      // {
      //   displayName: 'مجموعة الصنف',
      //   field: 'categoryName',
      //   visible: typeOfReport === 'تفصيلي',
      //   hasTotal: false,
      // },
      // {
      //   displayName: 'رقم الصنف',
      //   field: 'itemNumber',
      //   visible: typeOfReport === 'تفصيلي',
      //   hasTotal: false,
      // },
      {
        displayName: 'الصنف',
        field: 'itemName',
        visible: typeOfReport === 'تفصيلي' || typeOfReport === 'تجميع بالصنف',
        hasTotal: false,
      },
      {
        displayName: 'الوحدة',
        field: 'unitName',
        visible: typeOfReport === 'تفصيلي',
        hasTotal: false,
      },
      {
        displayName: 'الكمية',
        field: 'saleQuantity',
        visible: typeOfReport === 'تفصيلي',
        hasTotal: false,
      },
      {
        displayName: 'البونص',
        field: 'bonus',
        visible: typeOfReport === 'تفصيلي',
        hasTotal: true,
      },
      {
        displayName: 'تكلفة الوحدة',
        field: 'unitCost',
        visible: typeOfReport === 'تفصيلي',
        hasTotal: true,
      },
      {
        displayName: 'اجمالي التكلفة',
        field: 'allCostPrice',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'بيع الوحدة',
        field: 'unitPrice',
        visible: typeOfReport === 'تفصيلي',
        hasTotal: true,
      },
      {
        displayName: 'اجمالي البيع',
        field: 'totalSellPrice',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'الخصم',
        field: 'totalSellDiscount',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'اجمالي بعد الخصم',
        field: 'totalSellPriceDiscount',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'الربح',
        field: 'sellProfit',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'نسبة الربح',
        field: 'sellProfitRate',
        visible: true,
        hasTotal: true,
      },
      {
        displayName: 'التاريخ',
        field: 'theDate',
        visible: typeOfReport === 'تفصيلي' || typeOfReport === 'تجميع بالمستند',
        hasTotal: false,
      },
    ];
    return columnDefs;
  }

  pageSize: number = environment.PAGE_SIZE;
  pageIndex: number = 1;
  maxCount!: number;

  onLoadMoreData() {
    this.createRequestFilters();
    this.loading = true;
    this.apiService
      .getSalesProfitReport(this.salesProfitRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.tableDataService.updateTableData(res);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
  //request values binding
  time!: string;
  itemName!: string;
  costCenterName!: string;
  //page data
  filterForm!: FormGroup;
  salesProfitReport!: ISalesProfitReport[];
  salesProfitRequest!: ISalesProfitRequest;
  dateOptions!: IChipOption[];
  allSuppliers!: IcustomerAndSuplier[];
  itemType!: string;
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  totalSaleQuantity = 0;
  totalBonus = 0;
  totalUnitCost = 0;
  totalAllCostPrice = 0;
  totalUnitPrice = 0;
  totalSellPrice = 0;
  totalSellDiscount = 0;
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

  suplliers!: ISupplier[];
  filteredSuppliers!: Observable<ISupplier[]>;
  suppliersCtrl!: FormControl;
  categories!: ICategory[];
  filteredCategories!: Observable<ICategory[]>;
  categoriesCtrl!: FormControl;

  constructor(
    private apiService: APIService,
    private timeService: TimeService,
    private modalController: ModalController,
    private fb: FormBuilder,
    private tableDataService: SharedTableDataService
  ) {
    ///////
    this.tableDataService.setCurrentPageIndex(1);
    this.tableDataService
      .getCurrentPageIndex()
      .pipe(takeUntil(this.destroy$))
      .subscribe((pageIndex) => {
        this.pageIndex = pageIndex;
      });
    this.itemType = 'كافة الاصناف';
    // intialize form
    this.filterForm = new FormGroup({
      costCenterName: new FormControl('كافة المراكز', Validators.required),
      typeOfReport: new FormControl('تفصيلي', Validators.required),
      itemName: new FormControl('كافة الاصناف', Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(
        this.timeService.getMinTimeValue(),
        Validators.required
      ),
      maxTimeValue: new FormControl(
        this.timeService.getCurrentDate(),
        Validators.required
      ),
      supplierID: new FormControl(0, Validators.required),
      categoryID: new FormControl(0, Validators.required),
      clientName: new FormControl('كافة العملاء', Validators.required),
    });

    // intialize default values for page
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];

    // filter items names
    this.itemsNames = [];
    this.apiService
      .getitemName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.itemsNames = res;
      });

    this.itemsNamesCtrl = new FormControl('كافة الاصناف', Validators.required);
    this.filterdItemsNames = this.itemsNamesCtrl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((itemName) =>
        itemName ? this.filterItemsNames(itemName) : of(this.itemsNames.slice())
      )
    );
    //filter customer name
    this.customersNames = [];
    this.apiService
      .getCustomerNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.customersNames = res;
        this.allSuppliers = res;
      });

    this.customerNameCtrl = new FormControl(
      'كافة العملاء',
      Validators.required
    );
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
    this.apiService
      .getAllCostCenters()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
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

  ngOnInit() {
    this.tableDataService.setColumnDefs(this.getColumnDefs('تفصيلي'));
    this.filterForm
      .get('typeOfReport')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.tableDataService.setColumnDefs(this.getColumnDefs(value));
      });
    /////
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

  ngAfterViewInit() {
    this.loading = true;
    setTimeout(() => {
      this.modal.present();
      this.loading = false;
    }, 2000);
  }

  // filters methods
  filterCategories(name: string): ICategory[] {
    let res = this.categories.filter(
      (category) =>
        category.value.toLowerCase().indexOf(name.toLowerCase()) === 0
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
    this.itemsNamesCtrl.value.setValue(event.option.value);
  }

  createRequestFilters() {
    // this.tableDataService.setCurrentPageIndex(1);
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
    this.salesProfitRequest = {
      PageSize: this.pageSize,
      PageNumber: this.pageIndex,
      TypeOfReport: this.filterForm.get('typeOfReport')?.value,
      ItemName: this.filterForm.get('itemName')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      SupplierID: supplierID,
      CategoryID: categoryID,
      ClientName: this.customerNameCtrl.value,
      CostCenterName: this.costCenterCtrl.value,
    };
    // if (this.filterForm.get('itemName')?.value !== 'كافة الاصناف') {
    //   this.filterForm.get('itemName')?.setValue('صنف واحد');
    // }
  }
  //apply filters
  filterReport() {
    if (
      this.filterForm.invalid ||
      this.customerNameCtrl.invalid ||
      this.costCenterCtrl.invalid ||
      this.suppliersCtrl.invalid ||
      this.categoriesCtrl.invalid
    ) {
      return;
    }
    this.loading = true;
    this.createRequestFilters();
    this.apiService
      .getSalesProfitReport(this.salesProfitRequest)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tableDataService.setTableData(res);
          this.maxCount = this.apiService.getCurrentReportTotalCount;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        },
      });

    this.modalController.dismiss();
  }

  ngOnDestroy() {
    this.tableDataService.deleteTableColumns();
    this.tableDataService.deleteTableData();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
