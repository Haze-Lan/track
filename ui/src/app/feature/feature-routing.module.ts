import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TraceMapComponent } from './trace-map/trace-map.component';

const routes: Routes = [{path:"trace",component:TraceMapComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
