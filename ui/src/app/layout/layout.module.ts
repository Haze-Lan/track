import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default/default.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
  declarations: [
    DefaultComponent
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    NzLayoutModule,
  ]
})
export class LayoutModule { }
