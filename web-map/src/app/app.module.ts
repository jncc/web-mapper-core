import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [AppConfigService,
  {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfigService], multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
