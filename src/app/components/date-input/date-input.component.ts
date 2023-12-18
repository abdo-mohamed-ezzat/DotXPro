import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { TimeService } from '@app/services/time.service';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [DatePipe]
})
export class DateInputComponent  implements OnInit {
  @Input()timeType!: string;
  formatedFromDate!: string;
  formatedToDate!: string;
  @Output() fromDateEmit = new EventEmitter<string>();
  @Output() toDateEmit = new EventEmitter<string>();
  constructor(private datePipe: DatePipe, private timerService: TimeService) { 
    this.timeType = 'حتى يوم';
    this.formatedFromDate = this.timerService.getMinTimeValue();
    this.formatedToDate = this.timerService.getCurrentDate();
  }

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  ngOnInit() {

  }
  
}

