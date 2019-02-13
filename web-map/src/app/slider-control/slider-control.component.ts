import { Component, OnInit, Input } from '@angular/core';

import { Options } from 'ng5-slider';

@Component({
  selector: 'app-slider-control',
  templateUrl: './slider-control.component.html',
  styleUrls: ['./slider-control.component.scss']
})
export class SliderControlComponent implements OnInit {
  @Input() value: number;

  options: Options = {
    floor: 0,
    ceil: 1,
    showSelectionBar: true,
    step: 0.1
  };

  constructor() { }

  ngOnInit() {
  }

}
