import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  showLayers = true;
  showGotoXY = false;

  onToggleShowLayers() {
    this.showLayers = !this.showLayers;
  }

  onShowGotoXY() {
    this.showGotoXY = true;
  }

  onCloseGotoXY() {
    this.showGotoXY =  false;
  }
}
