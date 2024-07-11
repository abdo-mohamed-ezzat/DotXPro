import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, from, mergeMap, of, throwError } from 'rxjs';
import { APIService } from '@app/services/api.service';
import { Network } from '@capacitor/network';

@Injectable()
export class ConnectivityInterceptor implements HttpInterceptor {
  constructor(private apiService: APIService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(Network.getStatus()).pipe(
      mergeMap((status) => {
        if (status.connected) {
          return next.handle(request);
        } else {
          return throwError(() => new NoInternetConnectionError());
        }
      })
    );
  }
}
export class NoInternetConnectionError extends Error {
  constructor() {
    super('No internet connection. Please retry later.');
    Object.setPrototypeOf(this, NoInternetConnectionError.prototype);
  }
}