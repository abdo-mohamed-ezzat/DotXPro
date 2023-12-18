import { Component, Input, OnInit, Output } from '@angular/core';
import { IChipOption } from 'src/app/viewModels/ichip-option';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-chips',
  templateUrl: './select-chips.component.html',
  styleUrls: ['./select-chips.component.scss'],
})
export class SelectChipsComponent {
  @Input() selectOptions!: IChipOption[];
  @Output() selectedOption = new EventEmitter<IChipOption>();
  @Input()allowedMultiClick!: boolean;
  constructor() {
    this.allowedMultiClick = false;
  }
  optionslist!: IChipOption[];
  // onChipClick(id: number) {
  //   const clickedChip = this.selectOptions.find((option) => option.id === id);
  //   if (this.allowedMultiClick) {
  //     clickedChip!.clicked = !clickedChip?.clicked;
  //   } else {
  //     this.selectOptions.forEach((option) => {
  //       option.disabled = false;
  //     });

  //     this.selectOptions.forEach((option) => {
  //       if (option.id === id) {
  //         option.clicked = true;
  //       } else {
  //         option.clicked = false;
  //         option.disabled = true;
  //       }
  //     });
  //   }
  //   this.selectedOption.emit(clickedChip!);
  // }
  onChipClick(id: number) {
    //if multiable selction is allowed
    if (this.allowedMultiClick) {
      //select the new one without unselecting the others
      const clickedChip = this.selectOptions.find((option) => option.id === id);
      clickedChip!.clicked = !clickedChip?.clicked;
      this.selectedOption.emit(clickedChip!);
      return;
    } else {
      this.selectOptions.forEach((option) => {
        option.clicked = false;
      });
      const clickedChip = this.selectOptions.find((option) => option.id === id);
      clickedChip!.clicked = true;

      this.selectedOption.emit(clickedChip!);
      return;
    }
  }
}
