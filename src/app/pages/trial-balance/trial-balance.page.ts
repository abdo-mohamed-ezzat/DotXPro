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

  totalDain = 0;
  totalMd1 = 0;
  totalDain2 = 0;
  totalMd2 = 0;
  totalDain3 = 0;
  totalMd3 = 0;

  allLevels: ILevels = {
    0: 'كافة المستويات',
    1: 'المستوى الأول',
    2: 'المستوى الثاني',
    3: 'المستوى الثالث',
    4: 'المستوى الرابع',
    5: 'المستوى الخامس',
    6: 'المستوى السادس',
    'كافة المستويات': 0,
    'المستوى الأول': 1,
    'المستوى الثاني': 2,
    'المستوى الثالث': 3,
    'المستوى الرابع': 4,
    'المستوى الخامس': 5,
    'المستوى السادس': 6,
  };
  levels!: number[];

  filterForm!: FormGroup;
  constructor(
    private timeService: TimeService,
    private apiService: APIService,
    private modalController: ModalController
  ) {
    this.filterForm = new FormGroup({
      isBeforeRelay: new FormControl(false),
      time: new FormControl('حتى يوم'),
      minTimeValue: new FormControl(this.timeService.getMinTimeValue()),
      maxTimeValue: new FormControl(this.timeService.getCurrentDate()),
      level: new FormControl('كافة المستويات', Validators.required),
    });
    //initialize page properties
    this.dateOptions = [
      { id: 1, name: 'حتى يوم', clicked: true },
      { id: 2, name: 'خلال فترة', clicked: false },
    ];
  }

  ngOnInit() {
    this.levels = [0];
    this.apiService.getAccountsLevels().subscribe({
      next: (levels: number[]) => {
        this.levels = this.levels.concat(levels);
      },
    });
  }
  ngAfterViewInit() {
    this.modal.present();
  }

  setDateOption($event: IChipOption) {
    this.filterForm.get('time')?.setValue($event.name);
    this.time = $event.name;
  }

  filterReport() {
    if (this.filterForm.invalid) {
      return;
    }

    this.modalController.dismiss();
    this.trialBalanceRequest = {
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      Time: this.filterForm.get('time')?.value,
      MinTimeValue: this.filterForm.get('minTimeValue')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
      Level: Number(this.allLevels[this.filterForm.get('level')?.value]),
    };
    this.loading = true;
    this.apiService.getTrialBalanceReport(this.trialBalanceRequest).subscribe({
      next: (data) => {
        this.trialBalanceReport = data;
        this.trialBalanceReport.forEach(account => {
          this.totalDain += account.dain;
          this.totalMd1 += account.md1;
          this.totalDain2 += account.dain2;
          this.totalMd2 += account.md2;
          this.totalDain3 += account.dain3;
          this.totalMd3 += account.md3;
        });
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }
}
interface ILevels {
  [key: string]: number | string;
  [key: number]: number | string;
}
