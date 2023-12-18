import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IBalanceSheetReport } from 'src/app/viewModels/ibalance-sheet-report';
import { IBalanceSheetRequest } from 'src/app/viewModels/ibalance-sheet-request';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IChipOption } from '@app/viewModels/ichip-option';
import { ILevel } from '@app/viewModels/ilevel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.page.html',
  styleUrls: ['./balance-sheet.page.scss'],
})
export class BalanceSheetPage implements OnInit {
  levels!: ILevel[];
  filterdLevels!: Observable<ILevel[]>;

  filterForm!: FormGroup;

  // declare page properties
  dateOptions!: IChipOption[];
  balanceSheetReport!: IBalanceSheetReport[];
  balanceSheetRequest!: IBalanceSheetRequest;
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;
  constructor(
    private apiService: APIService,
    private modalController: ModalController,
    private TimeService: TimeService
  ) {
    this.dateOptions = [
      {
        name: 'حتى يوم',
        id: 0,
        clicked: true,
      },
    ];
    this.filterForm = new FormGroup({
      level: new FormControl('كافة المستويات', Validators.required),
      isBeforeRelay: new FormControl(false, Validators.required),
      maxTimeValue: new FormControl(
        this.TimeService.getCurrentDate(),
        Validators.required
      ),
    });
  }

  ngOnInit() {
    this.levels = [{ Id: 0, Level: 'كافة المستويات' }];
      this.apiService.getAccountsLevels().subscribe({
        next: (data) => this.levels.concat(data),
      });
  }
  ngAfterViewInit() {
    this.modal.present();
  }

  filterReport() {
    let levelName = this.filterForm.get('level')?.value;
    let matchingLevel = this.levels.find((level) => level.Level === levelName);
    let levelId = matchingLevel ? matchingLevel.Id : 0;

    if (this.filterForm.invalid) {
      return;
    }
    this.modalController.dismiss();
    this.loading = true;
    this.balanceSheetRequest = {
      //search in level by value of level control in form control then addign it to the request

      Level: levelId,
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };
    this.apiService.getBalanceSheetReport(this.balanceSheetRequest).subscribe({
      next: (data: IBalanceSheetReport[]) => {
        this.balanceSheetReport = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.log(error.message);
        this.loading = false;
      },
    });
  }
}
