import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-controls-container',
  templateUrl: './controls-container.component.html',
  styleUrls: ['./controls-container.component.scss']
})
export class ControlsContainerComponent implements OnInit {
  show = true;

  constructor() { }

  ngOnInit() {
  }

  toggleShow() {
    this.show = !this.show;
  }

}
