import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-account-statment-options',
  templateUrl: './account-statment-options.component.html',
  styleUrls: ['./account-statment-options.component.scss'],

})
export class AccountStatmentOptionsComponent  implements OnInit {

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}
