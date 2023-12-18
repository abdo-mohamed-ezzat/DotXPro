import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'total' })
export class TotalPipe implements PipeTransform {
  transform(items: Array<any>, field: string): number {
    return items.reduce((prev, cur) => prev + cur[field], 0);
  }
}