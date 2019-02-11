import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {DragDropModule} from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AppConfigService } from './app-config.service';
import { HttpClientModule } from '@angular/common/http';
import { LegendsComponent } from './legends/legends.component';
import { LegendItemComponent } from './legends/legend-item/legend-item.component';
import { ControlsToolbarComponent } from './controls-toolbar/controls-toolbar.component';
import { MapInstancesComponent } from './map-instances/map-instances.component';
import { LayersComponent } from './layers/layers.component';
import { LayerComponent } from './layers/layer/layer.component';
import { LayerGroupComponent } from './layers/layer-group/layer-group.component';
import { ControlsContainerComponent } from './controls-container/controls-container.component';
import { SubLayerGroupComponent } from './layers/sub-layer-group/sub-layer-group.component';

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
    LayerComponent,
    LayerGroupComponent,
    ControlsContainerComponent,
    SubLayerGroupComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [
    AppConfigService,
    {provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfigService], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
