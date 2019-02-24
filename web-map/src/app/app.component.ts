import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showLayers = true;

  constructor() {
  }

  onToggleShowLayers() {
    this.showLayers = !this.showLayers;
  }
}
