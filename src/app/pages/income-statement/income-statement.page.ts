import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/common';
import { APIService } from 'src/app/services/api.service';
import { TimeService } from 'src/app/services/time.service';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { IIncomeStatementReport } from 'src/app/viewModels/iincome-statement-report';
import { IIncomeStatementRequest } from 'src/app/viewModels/iincome-statement-request';
import { GestureController } from '@ionic/angular';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  dataSource!: MatTableDataSource<IIncomeStatementReport>;
  columnToDisplay: string[] = [
    'accountName',
    'accountNumber',
    'madeen',
    'dain'
  ]
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

  // declare request properties
  totalMadeen!: number;
  totalDain!: number;
  time!: string;
  pageNumber!: number;
  pageSize!: number;
  filterForm!: FormGroup;
  constructor(
    private timeService: TimeService,
    private apiService: APIService,
    private modalController: ModalController,
  ) {
    this.pageNumber = 1;
    this.pageSize = 100;
    //intialize form
    this.filterForm = new FormGroup({
      level: new FormControl('كافة المستويات', Validators.required),
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
    this.totalMadeen = 0;
    this.totalDain = 0;

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

  onScroll(index: number) {
    console.log(index);
    if (index+1 > this.incomeStatementReport.length - 10) { // If the user scrolls to the last 10 items
      this.loadMoreData();
    }
  }

  loadMoreData() {
    this.pageNumber++;
    this.loading = true;

    this.filterReport();

  }
  filterReport() {
    if (this.filterForm.invalid) return;
    this.modalController.dismiss();
    this.loading = true;
    this.totalMadeen = 0;
    this.totalDain = 0;
    this.incomeStatementRequest = {
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      Level: Number(this.allLevels[this.filterForm.get('level')?.value]),
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
          this.dataSource = new MatTableDataSource<IIncomeStatementReport>(report);
          this.incomeStatementReport.forEach((account) => {
            this.totalMadeen += account.madeen;
            this.totalDain += account.dain;
          });
          console.log(this.totalDain, this.totalMadeen);
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

interface ILevels {
  [key: string]: number | string;
  [key: number]: number | string;
}
