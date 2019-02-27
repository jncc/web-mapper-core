import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  cssUrl = '/assets/map-styles.css';

  showLayers = true;

  onToggleShowLayers() {
    this.showLayers = !this.showLayers;
  }
}
