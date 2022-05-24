import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
@Component({
  selector: 'app-trace-map',
  templateUrl: './trace-map.component.html',
  styleUrls: ['./trace-map.component.less']
})
export class TraceMapComponent implements OnInit {
  map!: Map;
  constructor() { }

  ngOnInit(): void {
    this.initMap()
  }

  initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }

}
