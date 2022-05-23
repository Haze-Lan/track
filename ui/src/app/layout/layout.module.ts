import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';


@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    NzMenuModule
  ]
})
export class LayoutModule { }
