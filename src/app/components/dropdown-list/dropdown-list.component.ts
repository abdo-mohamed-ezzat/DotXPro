import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
})
export class DropdownListComponent  implements OnInit {
  @Input() placeholder!: string;
  @Input() options!: string[];
  constructor() { }

  ngOnInit() {}

  handleChange(e: Event){

  }

  handleCancel(){

  }
  handleDismiss(){

  }

}
