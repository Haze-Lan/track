
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, addSeconds } from 'date-fns';
import { CMD, CMDType, TraceItem } from './common';
import { GeoMap } from './GeoMap';
import { Socket } from './socket';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.less']
})
export class AppComponent {
  items: TraceItem[] = []
  map!: GeoMap;
  validateForm!: FormGroup;
  second: number = 0;
  isLive: boolean = true;
  isConnect: boolean = false;
  interval!: any
  socket!: Socket
  timing!: Date
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.socket = new Socket(() => {
      //this.isConnect = true;
    }, () => {
     // this.isConnect = false;
    })
    this.map = new GeoMap("map");
    this.map.init();
    navigator.geolocation.getCurrentPosition(position => {
      this.map.zoomAndCenter(position.coords.longitude, position.coords.latitude)
    });
    this.map.listenClick((longitude: number, latitude: number) => {

      let speed = 0;
      if (this.items.length >= 1) {
        const pre = this.items[this.items.length - 1];
        const value = this.map.distance([pre.longitude, pre.latitude], [longitude, latitude])
        if ((this.second - pre.second) > 0) {
          speed = value / (this.second - pre.second) / 1000 * 60 * 60
          speed = parseFloat(speed.toFixed(2))
        } else {
          speed = pre.speed
        }
      }
      let nodeTiming = format(addSeconds(this.timing, this.second), "yyMMddHHmmss")
      let data: TraceItem = {
        number: this.validateForm.value.number,
        second: this.second,
        longitude: longitude,
        latitude: latitude,
        speed: speed,
        oil: 0,
        elevation: 0,
        direction: 0,
        time: nodeTiming
      };
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.second = this.second + 1;
        }, 1000)
      }
      this.items.push(data)
      if (this.isLive) {
        let cmd: CMD = {
          mode: CMDType.Point,
          data: JSON.stringify(data)
        }
        this.socket.sendCMD(cmd)
      }
    });
    this.validateForm = this.fb.group({
      number: ["000000109647", [Validators.required]],
      timing: [null, [Validators.required]],
      address: ["118.114.196.123:10112", [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.isConnect) {
      this.socket.sendCMD({ mode: CMDType.Logout, data: this.validateForm.value.number })
      this.isConnect = false;
      return
    } else {
      if (this.validateForm.valid) {
        this.timing = this.validateForm.value.timing
        this.socket.connect(this.validateForm.value.address, this.validateForm.value.number, format(this.timing, "yyyy-mm-dd HH:mm:ss"))
        this.isConnect = true;
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

  public clear() {
    this.map.clear();
    this.items = [];
    this.second = 0;
  }

}
