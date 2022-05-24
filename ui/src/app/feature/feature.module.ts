import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatureRoutingModule } from './feature-routing.module';
import { TraceMapComponent } from './trace-map/trace-map.component';


@NgModule({
  declarations: [
    TraceMapComponent
  ],
  imports: [
    CommonModule,
    FeatureRoutingModule
  ],
  exports:[TraceMapComponent]
})
export class FeatureModule { }
