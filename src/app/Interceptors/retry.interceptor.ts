import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, EMPTY, catchError, retryWhen, delay, mergeMap, of } from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      this.delayedRetry(1000, 3),
      catchError(error => {     
        if (error.status === 401 || error.status === 400 || error.status === 403) {
          this.router.navigateByUrl('abort-access', { replaceUrl: true });
        } else if (error.status === 500 || error.status === 502) {
          this.router.navigateByUrl('server-error', { replaceUrl: true });
          return EMPTY;
        }

        return throwError(() => new Error("request filed"));
      })
    );
  }

  delayedRetry(delayMs: number, maxRetry: number) {
    let retries = maxRetry;
  
    return (src: Observable<any>) =>
      src.pipe(
        retryWhen(errors => errors.pipe(
          mergeMap((error, index) => {
            if (index < maxRetry) {
              this.snackBar.open('اعادة المحاولة', 'إغلاق', { duration: 2000 });
              return of(error).pipe(delay(delayMs));
            } else {
              this.snackBar.open('فشلت العملية', 'إغلاق', { duration: 2000 });
              return throwError(() => new Error('Retrying...'));
            }
          })
        ))
      );
  }
}
