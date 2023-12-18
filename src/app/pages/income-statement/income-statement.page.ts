import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { IIncomeStatementReport } from 'src/app/viewModels/iincome-statement-report';
import { IIncomeStatementRequest } from 'src/app/viewModels/iincome-statement-request';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.page.html',
  styleUrls: ['./income-statement.page.scss'],
})
export class IncomeStatementPage implements OnInit {
  //declare page properties
  incomeStatementReport!: IIncomeStatementReport[];
  incomeStatementRequest!: IIncomeStatementRequest;
  dateOptions!: IChipOption[];
  loading: boolean = false;
  @ViewChild('modal') modal!: IonModal;

  // declare request properties
  
  time!: string;



  filterForm!: FormGroup;
  constructor(
    private timeService: TimeService,
    private apiService: APIService,
    private modalController: ModalController
  ) {

    //intialize form

    this.filterForm = new FormGroup({
      level: new FormControl(0, Validators.required),
      time: new FormControl('حتى يوم', Validators.required),
      minTimeValue: new FormControl(
        this.timeService.getMinTimeValue(),
        Validators.required
      ),
      maxTimeValue: new FormControl(
        this.timeService.getCurrentDate(),
        Validators.required
      ),
      isBeforeRelay: new FormControl(false, Validators.required),
      underLockDown: new FormControl(false, Validators.required),
      showCostCenter: new FormControl(false, Validators.required),
    });

    // intialize page properties
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.modal.present();
  }
  filterReport() {
    if(this.filterForm.invalid) return;
    this.modalController.dismiss();
    this.loading = true;
    this.incomeStatementRequest = {
      Level: this.filterForm.get('level')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      UnderLockDown: this.filterForm.get('underLockDown')?.value,
      ShowCostCenter: this.filterForm.get('showCostCenter')?.value,
    };
    this.apiService
      .getIncomeStatementReport(this.incomeStatementRequest)
      .subscribe({
        next: (report: IIncomeStatementReport[]) => {
          this.incomeStatementReport = report;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
        },
      });
  }

  // set emited values
  setDateOption(dateOptions: IChipOption) {
    this.filterForm.get('time')?.setValue(dateOptions.name);
    this.time = dateOptions.name;
  }
}
