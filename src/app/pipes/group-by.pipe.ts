import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [];
      }

      prev[cur[field]].push(cur);
      return prev;
    }, {});

    return Object.keys(groupedObj).map((key) => ({
      key,
      values: groupedObj[key],
    }));
  }
}
