import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedTableDataService } from '@app/services/shared-table-data.service';
import { ColumnDef } from '@app/viewModels/column-def';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import {
  Observable,
  Subject,
  Subscription,
  map,
  startWith,
  takeUntil,
} from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { Iitem } from 'src/app/viewModels/iitem';
import { IStockInventoryRequest } from 'src/app/viewModels/istock-inventory-request';
import { IStockInverntoryReport } from 'src/app/viewModels/istock-inverntory-report';
import { IStore } from 'src/app/viewModels/istore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-items-inventory',
  templateUrl: './items-inventory.page.html',
  styleUrls: ['./items-inventory.page.scss'],
})
export class ItemsInventoryPage implements OnInit {
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
    if (this.filterForm.get('isBeforeRelay')?.value) {
      this.apiService
        .getStockInventoryReportBeforeRelay(this.itemsInventoryRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (report) => {
            this.maxCount = this.apiService.getCurrentReportTotalCount;
            this.tableDataService.updateTableData(report);
            this.itemsInverntoryReport = report;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
    } else {
      this.apiService
        .getStockInventoryAfterRelay(this.itemsInventoryRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (report) => {
            this.maxCount = this.apiService.getCurrentReportTotalCount;
            this.tableDataService.updateTableData(report);
            this.itemsInverntoryReport = report;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
    }
  }

  getColumnDefs(isBeforeRelay: boolean): ColumnDef[] {
    const commonColumns: ColumnDef[] = [
      { displayName: 'الصنف', field: 'itemName', visible: true, hasTotal: false },
      { displayName: 'الوحدة الصغرى', field: 'unitName', visible: true, hasTotal: false },
      { displayName: 'الكمية المتوفرة', field: 'stockQuantity', visible: true, hasTotal: false },
      { displayName: 'تكلفة الوحدة', field: 'stockUnitCost', visible: true, hasTotal: true },
      { displayName: 'اجمالي التكلفة', field: 'stockTotalCost', visible: true, hasTotal: true },
      // { displayName: 'رقم الصنف', field: 'itemNumber', visible: true, hasTotal: false },
      // { displayName: 'الماركة', field: 'brandName', visible: true , hasTotal: false},
      { displayName: 'المخزن', field: 'storeName', visible: true },
      {
        displayName: 'تاريخ اخر حركة',
        field: 'theDate',
        visible: !isBeforeRelay,
      },
    ];
    return commonColumns;
  }

  //declare page properties
  inventoryOptions!: IChipOption[];
  timeOptinos!: IChipOption[];
  storeOptions!: IChipOption[];
  loading!: boolean;
  stores!: IStore[];
  totalStockQuantity = 0;
  totalStockUnitCost = 0;
  totalStockTotalCost = 0;

  //delcare request properties
  itemsInverntoryReport!: IStockInverntoryReport[];
  itemsInventoryRequest!: IStockInventoryRequest;

  itemName!: string;
  storesNames!: string[];

  filterForm!: FormGroup;

  //declare lists properties
  items!: Iitem[];
  filteredItems!: Observable<Iitem[]>;
  itemsCtrl!: FormControl;

  @ViewChild('modal') modal!: IonModal;

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

    //intialize filter form
    this.itemName = 'كافة الاصناف';
    this.filterForm = new FormGroup({
      itemName: new FormControl('كافة الاصناف', Validators.required),
      isInTheStock: new FormControl(false),
      isBeforeRelay: new FormControl(false),
      theMaxDate: new FormControl(
        this.timeSerivce.getCurrentDate(),
        Validators.required
      ),
      storesNames: new FormControl(['كافة المخازن']),
    });

    //initialize page properties
    this.timeOptinos = [{ id: 2, name: 'حتى يوم', clicked: true }];
    this.storeOptions = [
      { id: -1, name: 'كافة المخازن', clicked: true },
      { id: 0, name: 'المخزن الرئيسي', clicked: true, disabled: true },
    ];
    this.loading = false;
    this.storesNames = ['كافة المخازن'];

    //initialize lists properties
    this.items = [];
    this.itemsCtrl = new FormControl('كافة الاصناف', Validators.required);
    this.filteredItems = this.itemsCtrl.valueChanges.pipe(
      startWith(''),
      map((item) => (item ? this.filterItems(item) : this.items.slice()))
    );
  }

  ngOnInit() {
    this.tableDataService.setColumnDefs(
      this.getColumnDefs(this.filterForm.get('isBeforeRelay')?.value)
    );
    this.filterForm
      .get('isBeforeRelay')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((isBeforeRelay) => {
        this.tableDataService.setColumnDefs(this.getColumnDefs(isBeforeRelay));
      });
    this.apiService
      .getAllStores()
      .pipe(takeUntil(this.destroy$))
      .pipe(takeUntil(this.destroy$))
      .subscribe((stores) => {
        this.stores = stores;
        let i = 0;
        for (let store of this.stores) {
          if (i)
            this.storeOptions.push({
              id: i,
              name: store.value,
              clicked: true,
              disabled: true,
            });
          i++;
        }
      });

    this.apiService
      .getitemName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.items = items;
      });
  }

  // onTypeOfReportChange(event: Event) {
  //   const customEvent = event as CustomEvent;
  //   if (customEvent.detail.value === 'كافة الاصناف') {
  //     this.filterForm.get('itemName')?.setValue('كافة الاصناف');
  //     this.modal.present();
  //   }
  // }

  ngAfterViewInit() {
    this.modal.present();
  }

  handleToDate(date: string) {
    this.filterForm.get('theMaxDate')?.setValue(date);
  }

  filterItems(itemName: string): Iitem[] {
    let res = this.items.filter(
      (name) => name.value.toLowerCase().indexOf(name.value.toLowerCase()) === 0
    );
    return res;
  }

  setInventoryName(inventoryOption: IChipOption) {
    const name = inventoryOption.name;
    if (name == 'كافة المخازن') {
      if (this.storesNames.includes('كافة المخازن')) {
        this.storesNames = [];
        this.storeOptions.forEach((option) => {
          if (option.name != 'كافة المخازن') {
            option.clicked = false;
            option.disabled = false;
          }
        });
      } else {
        this.storesNames = ['كافة المخازن'];
        this.storeOptions.forEach((option) => {
          if (option.name != 'كافة المخازن') {
            option.clicked = true;
            option.disabled = true;
          }
        });
      }
    } else {
      if (this.storesNames.includes(name)) {
        this.storesNames = this.storesNames.filter((_name) => _name !== name);
      } else {
        this.storesNames.push(name);
      }
    }
    this.filterForm.get('storesNames')?.setValue(this.storesNames);
  }

  setOneItemValueOption(event: MatAutocompleteSelectedEvent) {
    this.filterForm.get('itemName')?.setValue(event.option.value);
    // this.modal.present();
  }

  createRequestFilters() {
    this.itemsInventoryRequest = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      StoreName: this.storesNames as string[],
      ItemName: this.filterForm.get('itemName')?.value,
      IsInTheStock: !this.filterForm.get('isInTheStock')?.value,
      TheMaxDate: this.filterForm.get('theMaxDate')?.value,
    };
  }

  applyFilter() {
    if (this.filterForm.invalid) {
      return;
    }

    if (this.filterForm.get('storesNames')?.value.length == 0) {
      this.storesNames = ['كافة المخازن'];
      this.storeOptions.forEach((option) => {
        if (option.name != 'كافة المخازن') {
          option.clicked = true;
          option.disabled = true;
        } else {
          option.clicked = true;
          option.disabled = false;
        }
      });
    }

    this.modalController.dismiss();
    this.loading = true;
    this.createRequestFilters();
    this.itemsInverntoryReport = [];
    if (this.filterForm.get('isBeforeRelay')?.value) {
      this.apiService
        .getStockInventoryReportBeforeRelay(this.itemsInventoryRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (report) => {
            this.maxCount = this.apiService.getCurrentReportTotalCount;
            this.tableDataService.setTableData(report);
            this.itemsInverntoryReport = report;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
          },
        });
    } else {
      this.apiService
        .getStockInventoryAfterRelay(this.itemsInventoryRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (report) => {
            this.maxCount = this.apiService.getCurrentReportTotalCount;
            this.tableDataService.setTableData(report);
            this.itemsInverntoryReport = report;
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
