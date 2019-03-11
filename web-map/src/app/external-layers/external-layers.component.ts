import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-external-layers',
  templateUrl: './external-layers.component.html',
  styleUrls: ['./external-layers.component.scss']
})
export class ExternalLayersComponent implements OnInit {
  @Output() closeExternalLayers = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onCloseExternalLayers() {
    this.closeExternalLayers.emit();
  }

}
