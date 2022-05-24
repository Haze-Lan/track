import { Component } from '@angular/core';
import { GeoMap } from './GeoMap';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {
  map!: GeoMap;
  constructor() { }

  ngOnInit(): void {
    this.map = new GeoMap("map");
    this.map.init();
    navigator.geolocation.getCurrentPosition(position => {
      this.map.zoomAndCenter(position.coords.longitude, position.coords.latitude)
    });
  }
}
