import { Component, OnInit } from '@angular/core';
import { GeoMap } from 'src/app/GeoMap';

@Component({
  selector: 'app-trace-map',
  templateUrl: './trace-map.component.html',
  styleUrls: ['./trace-map.component.less']
})
export class TraceMapComponent implements OnInit {
  map!: GeoMap;
  constructor() { }

  ngOnInit(): void {
    this.map = new GeoMap("map");
    this.map.init();
    navigator.geolocation.getCurrentPosition(position => {
      this.map.zoomAndCenter(position.coords.longitude, position.coords.latitude)
    });
  }

  initMap(): void {

  }

}
