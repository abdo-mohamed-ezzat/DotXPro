import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ListModalComponent } from "./list-modal.component";

@NgModule({
    imports: [CommonModule, IonicModule, FormsModule],
    declarations: [ListModalComponent],
    exports: [
        ListModalComponent
     ],
})

export class ListModalModule { }