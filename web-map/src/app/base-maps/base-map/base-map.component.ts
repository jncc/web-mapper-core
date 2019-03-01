import { Component, OnInit, Input } from '@angular/core';

import Tile from 'ol/layer/tile';

@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.scss']
})
export class BaseMapComponent implements OnInit {

  @Input() baseLayer: Tile;

  constructor() { }

  ngOnInit() {
  }

}
