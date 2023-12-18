import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TableComponentModule } from './components/table/table.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';

import {
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { RetryInterceptor } from './Interceptors/retry.interceptor';
import { ErrorInterceptor } from './Interceptors/error.interceptor';
import { JWTInterceptor } from './Interceptors/jwt.interceptor';
import { AlertModule } from './components/alert/alert.module';

@NgModule({
  declarations: [AppComponent
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    TableComponentModule,
    BrowserAnimationsModule,
    ScrollingModule,
    AlertModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
    DatePipe,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: RetryInterceptor,
    //   multi: true,
    // },
        {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
        {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true,
    },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
