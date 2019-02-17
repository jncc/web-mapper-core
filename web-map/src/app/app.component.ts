import { Component } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { XmlConverter } from './xmlconverter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    // console.log(AppConfigService.settings);
    const converter = new XmlConverter();
    converter.convert();
  }
}
