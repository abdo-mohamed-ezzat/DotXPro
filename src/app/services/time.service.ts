import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor(private datePipe: DatePipe) {

   }

  formatDate(date: Date): string {
    const transformedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    return transformedDate ? transformedDate : '0000-00-00';
  }

  getCurrentDate(): string {
    return this.formatDate(new Date());
  }
  getCurrentYear(): string {
    return new Date().getFullYear().toString();
  }

  getMinTimeValue(): string {
    return `${this.getCurrentYear()}-01-01`;
  }
}
