import { APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { Ng5SliderModule } from 'ng5-slider';
import { NgSelectModule } from '@ng-select/ng-select';


import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AppConfigService } from './app-config.service';
import { ActiveLayersComponent } from './active-layers/active-layers.component';
import { ActiveLayerComponent } from './active-layers/active-layer/active-layer.component';
import { ControlsToolbarComponent } from './controls-toolbar/controls-toolbar.component';
import { MapInstancesComponent } from './map-instances/map-instances.component';
import { LayersComponent } from './layers/layers.component';
import { LayerComponent } from './layers/layer/layer.component';
import { LayerGroupComponent } from './layers/layer-group/layer-group.component';
import { ControlsContainerComponent } from './controls-container/controls-container.component';
import { SubLayerGroupComponent } from './layers/sub-layer-group/sub-layer-group.component';
import { FeatureInfosComponent } from './feature-infos/feature-infos.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SliderControlComponent } from './slider-control/slider-control.component';
import { LegendComponent } from './legend/legend.component';
import { FilterControlsComponent } from './filter-controls/filter-controls.component';
import { FilterControlComponent } from './filter-controls/filter-control/filter-control.component';
import { SafeResourceUrlPipe } from './safe-resource-url.pipe';
import { SafeCssPipe } from './safe-css.pipe';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { GazetteerComponent } from './gazetteer/gazetteer.component';

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ActiveLayersComponent,
    ActiveLayerComponent,
    ControlsToolbarComponent,
    MapInstancesComponent,
    LayersComponent,
    LayerComponent,
    LayerGroupComponent,
    ControlsContainerComponent,
    SubLayerGroupComponent,
    FeatureInfosComponent,
    SafeHtmlPipe,
    SliderControlComponent,
    LegendComponent,
    FilterControlsComponent,
    FilterControlComponent,
    SafeResourceUrlPipe,
    SafeCssPipe,
    TooltipComponent,
    TooltipDirective,
    GazetteerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
    Ng5SliderModule,
    NgSelectModule
  ],
  providers: [
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [TooltipComponent]
})
export class AppModule { }
