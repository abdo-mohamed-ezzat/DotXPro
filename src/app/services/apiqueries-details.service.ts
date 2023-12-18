import { Injectable } from '@angular/core';
import { IAccountStatementRequest } from '../viewModels/iaccount-statement-request';

@Injectable({
  providedIn: 'root',
})
export class APIQueriesDetailsService {
  constructor() {}
  accountStatementQuery!: IAccountStatementRequest;

  setAttributes<T extends keyof IAccountStatementRequest>(
    attributeName: T,
    attributeValue: IAccountStatementRequest[T]
  ) {
    console.log('attributeName:', attributeName);
  console.log('attributeValue:', attributeValue);

    this.accountStatementQuery[attributeName] = attributeValue;

    console.log(this.accountStatementQuery);
  }
  
}
