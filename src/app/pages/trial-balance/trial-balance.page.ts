import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { ITrialBalanceReport } from 'src/app/viewModels/itrial-balance-report';
import { ITrialBalanceRequest } from 'src/app/viewModels/itrial-balance-request';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.page.html',
  styleUrls: ['./trial-balance.page.scss'],
})
export class TrialBalancePage implements OnInit {
  //declare request properties
  trialBalanceRequest!: ITrialBalanceRequest;
  time!: string;

  //declare page properties
  trialBalanceReport!: ITrialBalanceReport[];
  dateOptions!: IChipOption[];
  @ViewChild('modal') modal!: IonModal;
  loading: boolean = false;

  filterForm!: FormGroup;
  constructor(
    private timeService: TimeService,
    private apiService: APIService,
    private modalController: ModalController,
  ) {
    this.filterForm = new FormGroup({
      isBeforeRelay: new FormControl(false),
      time: new FormControl('حتى يوم'),
      minTimeValue: new FormControl(this.timeService.getMinTimeValue()),
      maxTimeValue: new FormControl(this.timeService.getCurrentDate()),
      level: new FormControl(0, Validators.required),
    });
    //initialize page properties
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.modal.present();
  }

  setDateOption($event: IChipOption) {
    this.filterForm.get('time')?.setValue($event.name);
    this.time = $event.name;
  }

  filterReport() {
    if(this.filterForm.invalid){
      return;
    }

    this.modalController.dismiss();
    this.trialBalanceRequest = {
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      Level: this.filterForm.get('level')?.value,
    };
    this.loading = true;
    this.apiService
      .getTrialBalanceReport(this.trialBalanceRequest)
      .subscribe({
        next: (data) => {
        this.trialBalanceReport = data;
        this.loading = false; 
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }
}
