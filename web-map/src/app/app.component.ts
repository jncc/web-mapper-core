import { Component, OnDestroy } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { XmlConverter } from './xmlconverter';
import { MapService } from './map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    const converter = new XmlConverter();
    converter.convert();
  }
}
