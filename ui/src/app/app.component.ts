import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TraceItem } from './common';
import { GeoMap } from './GeoMap';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {
  items: TraceItem[] = []
  map!: GeoMap;
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.map = new GeoMap("map");
    this.map.init();
    navigator.geolocation.getCurrentPosition(position => {
      this.map.zoomAndCenter(position.coords.longitude, position.coords.latitude)
    });
    this.map.listenClick((longitude: number, latitude: number) => {
      let data: TraceItem = {
        longitude: longitude,
        latitude: latitude,
        speed: 0,
        oil: 0,
        elevation: 0,
        direction: 0,
        time: new Date()
      };

      this.items.push(data)
    });
    this.validateForm = this.fb.group({
      number: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
