import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-layer-item',
  templateUrl: './layer-item.component.html',
  styleUrls: ['./layer-item.component.scss']
})
export class LayerItemComponent implements OnInit {

  @Input() layer: string;

  constructor() { }

  ngOnInit() {
  }

}
