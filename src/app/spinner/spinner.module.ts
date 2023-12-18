import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SpinnerComponent } from './spinner.component';
@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [
        SpinnerComponent
    ],
    exports: [
        SpinnerComponent
    ]
})

export class SpinnerModule {}