import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Content-Type', 'application/json'),
      withCredentials: true
    });

    return next.handle(clonedRequest);
  }
}
