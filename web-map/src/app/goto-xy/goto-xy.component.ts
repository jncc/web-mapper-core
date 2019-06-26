import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-goto-xy',
  templateUrl: './goto-xy.component.html',
  styleUrls: ['./goto-xy.component.scss']
})
export class GotoXyComponent implements OnInit, AfterViewInit {
  @ViewChild('x', { static: true }) xInput: ElementRef;
  @Output() closeGotoXY = new EventEmitter<void>();

  xErrorMessage = 'Lon must be between -180 and 180 degrees';
  yErrorMessage = 'Lat must be between -90 and 90 degrees';
  xValid = true;
  yValid = true;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.xInput.nativeElement.focus();
    }, 100);
  }

  onGotoXY(x: string, y: string) {
    this.xValid = true;
    this.yValid = true;

    let lon = 0;
    let lat = 0;

    // validate x
    if (x === '' || x === undefined || isNaN(Number(x))) {
      this.xValid = false;
    } else {
      lon = Number(x);
      if (lon < -180 || lon > 180) {
        this.xValid = false;
      }
    }

    // validate y
    if (y === '' || y === undefined || isNaN(Number(y))) {
      this.yValid = false;
    } else {
      lat = Number(y);
      if (lat < -90 || lat > 90) {
        this.yValid = false;
      }
    }

    // pan or show error message
    if (this.xValid && this.yValid) {
      this.mapService.panToLonLat(Number(x), Number(y));
    }
  }

  onCloseGotoXY() {
    this.closeGotoXY.emit();
  }

}
