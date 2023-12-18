import { Component, OnInit } from '@angular/core';
import { AlertService } from '@app/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  private subscription!: Subscription;
  alert: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.onAlert().subscribe((alert) => {
      switch (alert?.type) {
        case 'success':
          alert.cssClass = 'alert alert-success';
          break;
        case 'error':
          alert.cssClass = 'alert alert-danger';
          break;
      }

      this.alert = alert;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
