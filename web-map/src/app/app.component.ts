import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  cssUrl = '/assets/map-styles.css';

  showLayers = true;
  showGotoXY = false;

  onToggleShowLayers() {
    this.showLayers = !this.showLayers;
  }

  onShowGotoXY() {
    this.showGotoXY = true;
    console.log(this.showGotoXY);
  }

  onCloseGotoXY() {
    this.showGotoXY =  false;
  }
}
