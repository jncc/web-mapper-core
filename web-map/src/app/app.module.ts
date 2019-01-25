import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { LegendsComponent } from './legends/legends.component';
import { LegendItemComponent } from './legends/legend-item/legend-item.component';
import { ControlsToolbarComponent } from './controls-toolbar/controls-toolbar.component';
import { MapInstancesComponent } from './map-instances/map-instances.component';
import { LayersComponent } from './layers/layers.component';
import { LayerItemComponent } from './layers/layer-item/layer-item.component';

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    LegendsComponent,
    LegendItemComponent,
    ControlsToolbarComponent,
    MapInstancesComponent,
    LayersComponent,
    LayerItemComponent
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
