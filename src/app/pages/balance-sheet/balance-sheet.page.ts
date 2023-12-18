import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IBalanceSheetReport } from 'src/app/viewModels/ibalance-sheet-report';
import { IBalanceSheetRequest } from 'src/app/viewModels/ibalance-sheet-request';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IChipOption } from '@app/viewModels/ichip-option';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.page.html',
  styleUrls: ['./balance-sheet.page.scss'],
})
export class BalanceSheetPage implements OnInit {
  levels!: number[];
  totalMadeen!: number;
  totalDain!: number;
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
    this.totalDain = 0;
    this.totalMadeen = 0;
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
    this.levels = [0];
    this.apiService.getAccountsLevels().subscribe({
      next: (data) => (this.levels = this.levels.concat(data)),
    });
  }

  ngAfterViewInit() {
    this.modal.present();
  }

  filterReport() {
    if (this.filterForm.invalid) {
      return;
    }
    this.modalController.dismiss();
    this.loading = true;
    this.balanceSheetRequest = {
      Level: Number(this.allLevels[this.filterForm.get('level')?.value]),
      IsBeforeRelay: this.filterForm.get('isBeforeRelay')?.value,
      MaxTimeValue: this.filterForm.get('maxTimeValue')?.value,
    };

    this.apiService.getBalanceSheetReport(this.balanceSheetRequest).subscribe({
      next: (data: IBalanceSheetReport[]) => {
        this.balanceSheetReport = data;
        this.balanceSheetReport.forEach((report) => {
          this.totalMadeen += report.madeen;
          this.totalDain += report.dain;
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.log(error.message);
        this.loading = false;
      },
    });
  }
}
interface ILevels {
  [key: string]: number | string;
  [key: number]: number | string;
}
