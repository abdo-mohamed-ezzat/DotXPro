import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '@app/services/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.authenticationService.userValue;
    const isloggedIn = user?.token;
    const isApiUrl = request.url.startsWith(environment.APIURL);
    if(isloggedIn && isApiUrl){
      request = request.clone({
        setHeaders:{
          Authorization: `Bearer ${user?.token}`
        }
      })
    }
    return next.handle(request);
  }
}
