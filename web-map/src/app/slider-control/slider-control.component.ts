import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Options, ChangeContext } from 'ng5-slider';

@Component({
  selector: 'app-slider-control',
  templateUrl: './slider-control.component.html',
  styleUrls: ['./slider-control.component.scss']
})
export class SliderControlComponent implements OnInit {
  @Input() value: number;
  @Output() valueChanged = new EventEmitter<number>();

  options: Options = {
    floor: 0,
    ceil: 1,
    showSelectionBar: true,
    step: 0.01
  };

  constructor() { }

  ngOnInit() {
  }

  onUserChange(changeContext: ChangeContext): void {
    this.valueChanged.emit(changeContext.value);
  }
}
