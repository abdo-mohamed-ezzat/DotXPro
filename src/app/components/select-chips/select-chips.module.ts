import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SelectChipsComponent } from "./select-chips.component";
import { CommonModule } from "@angular/common";
@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations: [SelectChipsComponent],
    exports: [SelectChipsComponent]
})

export class SelectChipsModule { }