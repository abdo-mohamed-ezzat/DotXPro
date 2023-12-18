import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ModalController, RadioGroupChangeEventDetail } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { IonRadioGroupCustomEvent } from '@ionic/core';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { Iitem } from 'src/app/viewModels/iitem';
import { IStockInventoryRequest } from 'src/app/viewModels/istock-inventory-request';
import { IStockInverntoryReport } from 'src/app/viewModels/istock-inverntory-report';
import { IStore } from 'src/app/viewModels/istore';

@Component({
  selector: 'app-items-inventory',
  templateUrl: './items-inventory.page.html',
  styleUrls: ['./items-inventory.page.scss'],
})
export class ItemsInventoryPage implements OnInit {
  //declare page properties
  inventoryOptions!: IChipOption[];
  timeOptinos!: IChipOption[];
  storeOptions!: IChipOption[];
  loading!: boolean;
  stores!: IStore[];
  private subscriptions: Subscription[] = [];

  //delcare request properties
  itemsInverntoryReport!: IStockInverntoryReport[];
  itemsInventoryRequest!: IStockInventoryRequest;

  //declare request properties
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
    private timeSerivce: TimeService
  ) {

    //intialize filter form
    this.itemName = 'كافة الاصناف';
    this.filterForm = new FormGroup({
      itemName: new FormControl('كافة الاصناف'),
      isInTheStock: new FormControl(false),
      isBeforeRelay: new FormControl(false),
      theMaxDate: new FormControl(
        this.timeSerivce.getCurrentDate(),
        Validators.required
      ),
      storesNames: new FormControl(['المخزن الرئيسي'])
    });

    //initialize page properties
    this.timeOptinos = [{ id: 2, name: 'حتى يوم', clicked: true }];
    this.storeOptions = [{ id: 0, name: 'المخزن الرئيسي', clicked: true }];
    this.loading = false;
    this.storesNames = ['المخزن الرئيسي'];

    //initialize lists properties
    this.items = [];
    this.itemsCtrl = new FormControl('كافة الاصناف', Validators.required);
    this.filteredItems = this.itemsCtrl.valueChanges.pipe(
      startWith(''),
      map((item) => (item ? this.filterItems(item) : this.items.slice()))
    );
  }

  ngOnInit() {
    this.apiService.getAllStores().subscribe((stores) => {
      this.stores = stores;
      let i = 0;
      for (let store of this.stores) {
        if (i)
          this.storeOptions.push({ id: i, name: store.value, clicked: false });
        i++;
      }
    });
    this.subscriptions.push(
      this.apiService.getitemName().subscribe((items) => {
        this.items = items;
      })
    );
  }

  onTypeOfReportChange(event: Event) {
    const customEvent = event as CustomEvent;
    if (customEvent.detail.value === 'كافة الاصناف') {
      this.filterForm.get('itemName')?.setValue('كافة الاصناف');
      this.modal.present();
    }
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  ngOnDestroy() {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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
    let index = this.storesNames.indexOf(inventoryOption.name, 0);
    if (index > -1) {
      this.storesNames.splice(index, 1);
    } else {
      this.storesNames.push(inventoryOption.name);
    }
    this.filterForm.get('storesNames')?.setValue(this.storesNames);
  }

  setOneItemValueOption(event: MatAutocompleteSelectedEvent) {
    this.filterForm.get('itemName')?.setValue(event.option.value);
    this.modal.present();
  }

  applyFilter() {
    if (this.filterForm.invalid) {
      return;
    }
    this.modalController.dismiss();
    this.loading = true;
    this.itemsInverntoryReport = [];
    this.itemsInventoryRequest = {
      StoreName: this.filterForm.get('storesNames')?.value,
      ItemName: this.filterForm.get('itemName')?.value,
      IsInTheStock: !this.filterForm.get('isInTheStock')?.value,
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      TheMaxDate: this.filterForm.get('theMaxDate')?.value,
    };
    console.log(this.filterForm.value);
    if (this.filterForm.get('isBeforeRelay')?.value) {
      this.subscriptions.push(
        this.apiService
          .getStockInventoryReportBeforeRelay(this.itemsInventoryRequest)
          .subscribe({
            next: (report) => {
              this.itemsInverntoryReport = report;
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
            },
          })
      );
    } else {
      this.subscriptions.push(
        this.apiService
          .getStockInventoryAfterRelay(this.itemsInventoryRequest)
          .subscribe({
            next: (report) => {
              this.itemsInverntoryReport = report;
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
            },
          })
      );
    }
  }
}
