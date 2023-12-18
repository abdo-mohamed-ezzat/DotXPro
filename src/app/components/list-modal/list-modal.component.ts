import { Component, OnInit, Input } from '@angular/core';
import { IAccount } from 'src/app/viewModels/iaccount';

@Component({
  selector: 'app-list-modal',
  templateUrl: './list-modal.component.html',
  styleUrls: ['./list-modal.component.scss'],
})
export class ListModalComponent  implements OnInit {
  @Input()accounts!: IAccount[];
  constructor() { }

  ngOnInit() {}

}
