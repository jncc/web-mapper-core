import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { ApiService } from './api.service';
import { IMapConfig } from './models/map-config.model';

// TODO: move to another service
import TileWMS from 'ol/source/tilewms';
import Tile from 'ol/layer/tile';
import { ILayerConfig } from './models/layer-config.model';
import { ILayerGroupConfig } from './models/layer-group-config';
import { ISubLayerGroupConfig } from './models/sub-layer-group-config';
import Layer from 'ol/layer/layer';
import { FeatureInfosComponent } from './feature-infos/feature-infos.component';
import WMSCapabilities from 'ol/format/wmscapabilities';

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnDestroy {

  map: any;

  zoomInExtent = new Subject<boolean>();
  zoomOutExtent = new Subject<boolean>();
  zoom = new Subject<{ center: number[], zoom: number }>();

  showLegendSubject = new Subject<{ name: string, legendUrl: string }>();

  private dataStore: {
    mapConfig: IMapConfig;
    layerLookup: ILayerConfig[];
    visibleLayers: ILayerConfig[];
    featureInfos: any[];
  };

  private _mapConfig: BehaviorSubject<IMapConfig>;
  get mapConfig() {
    return this._mapConfig.asObservable();
  }

  private _visibleLayers: BehaviorSubject<ILayerConfig[]>;
  get visibleLayers() {
    return this._visibleLayers.asObservable();
  }

  private _featureInfos: BehaviorSubject<any[]>;
  get featureInfos() {
    return this._featureInfos.asObservable();
  }
  private featureInfoSubscription: Subscription;

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.dataStore = {
      mapConfig: {
        mapInstances: [],
        mapInstance: {
          name: '',
          description: '',
          layerGroups: [],
          center: [],
          zoom: 0
        }
      },
      layerLookup: [],
      visibleLayers: [],
      featureInfos: []
    };
    this._mapConfig = <BehaviorSubject<IMapConfig>>new BehaviorSubject(this.dataStore.mapConfig);
    this._visibleLayers = <BehaviorSubject<ILayerConfig[]>>new BehaviorSubject(this.dataStore.visibleLayers);
    this._featureInfos = <BehaviorSubject<any[]>>new BehaviorSubject(this.dataStore.featureInfos);
    this.subscribeToConfig();

    this.subscribeToMapInstanceConfig();
  }

  private subscribeToConfig() {
    this.apiService.getConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstances = data;
      this._mapConfig.next(this.dataStore.mapConfig);
    }, error => console.log('Could not load map config.'));
  }

  private subscribeToMapInstanceConfig() {
    this.apiService.getMapInstanceConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstance = data;
      // console.log(this.dataStore.mapConfig.mapInstance);
      this.createMapInstanceConfig();
      // TODO: move to another service
      this.createLayersForConfig();
      this._mapConfig.next(this.dataStore.mapConfig);
      // console.log(this.dataStore.mapConfig);
      this.zoomToMapExtent();
    }, error => console.log('Could not load map instance config.'));
  }

  private createMapInstanceConfig() {
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach((layerGroupConfig: ILayerGroupConfig) => {
      const subLayerGroups: ISubLayerGroupConfig[] = layerGroupConfig.layers.
        map((layer) => layer.subLayerGroup).
        reduce((a: ISubLayerGroupConfig[], subLayerGroup, index) => {
          if (!a.find((slg) => subLayerGroup === slg.name)) {
            a.push({ name: subLayerGroup, layers: [], sublayerGroupId: index });
          }
          return a;
        }, []);
      layerGroupConfig.layers.forEach((layer) => {
        const subLayerGroup = subLayerGroups.find((slg) => slg.name === layer.subLayerGroup);
        subLayerGroup.layers.push(layer);
      });
      layerGroupConfig.subLayerGroups = subLayerGroups;
    });
  }

  // TODO: move to another service
  private createLayersForConfig(): void {
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach((layerGroupConfig) => {
      if (layerGroupConfig.layers.length) {
        layerGroupConfig.layers.forEach((layerConfig: ILayerConfig, index: number) => {
          // TODO: styles - this is just exploring styles in getcapabilities
          // const layerName = layerConfig.layerName;
          // const legendLayerName = layerConfig.legendLayerName;
          // this.getStyles(layerName, legendLayerName, layerConfig.url);
          const source = new TileWMS({
            url: layerConfig.url,
            params: { 'LAYERS': layerConfig.layerName },
            crossOrigin: 'anonymous'
          });
          layerConfig.layer = new Tile({
            source: source
          });
          layerConfig.layer.setOpacity(layerConfig.opacity);
          layerConfig.layer.setVisible(layerConfig.visible);

          if (layerConfig.visible) {
            this.dataStore.visibleLayers = [layerConfig, ...this.dataStore.visibleLayers];
          }
          this.dataStore.layerLookup.push(layerConfig);
        });
      }
    });
    this._visibleLayers.next(this.dataStore.visibleLayers);
  }

  private getStyles(layerName, legendLayerName, url) {
    const capabilitiesUrl = url + '?REQUEST=GetCapabilities&VERSION=1.3.0';
    this.apiService.getCapabilities(capabilitiesUrl).subscribe(data => {
      const parser = new WMSCapabilities();
      const result = parser.read(data);
      console.log(layerName);
      const layer = result.Capability.Layer.Layer.find(l => l.Name === layerName);
      if (layer.hasOwnProperty('Layer')) {
        console.log('I\'m a group layer');
        if (layer.Layer) {
          console.log(legendLayerName);
          console.log(layer.Layer);
          const layer2 = layer.Layer.find(l => l.Name === 'emodnet:' + legendLayerName);
          if (layer2.Style) {
            console.log(layer2.Style);
          }
          // console.log(layer2);
        }
      } else {
        console.log('I\'m just a layer');
      }
      // console.log(result.Capability.Layer.Layer.find(l => l.Name === layerName));
    });
  }

  mapReady(map: any) {
    this.map = map;
  }

  zoomIn() {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }

  zoomOut() {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }

  zoomToMapExtent() {
    const center = this.dataStore.mapConfig.mapInstance.center;
    const zoom = this.dataStore.mapConfig.mapInstance.zoom;
    this.zoom.next({ center: center, zoom: zoom });
  }

  zoomToLayerExtent(layerId: number) {
    const currentLayerConfig = this.dataStore.layerLookup.find((layerConfig) => layerConfig.layerId === layerId);
    this.zoom.next({ center: currentLayerConfig.center, zoom: currentLayerConfig.zoom });
  }

  zoomInToExtent(activated: boolean) {
    this.zoomInExtent.next(activated);
  }

  zoomOutToExtent(activated: boolean) {
    this.zoomOutExtent.next(activated);
  }

  showFeatureInfo(urls: string[]) {
    if (this.featureInfoSubscription) {
      this.featureInfoSubscription.unsubscribe();
    }
    this.featureInfoSubscription = this.apiService.getFeatureInfoForUrls(urls).subscribe(data => {
      this.dataStore.featureInfos = data;
      this._featureInfos.next(this.dataStore.featureInfos);
    });
  }

  clearFeatureInfo() {
    this.dataStore.featureInfos = [];
    this._featureInfos.next(this.dataStore.featureInfos);
  }

  changeLayerVisibility(layerId: number, visible: boolean) {
    const currentLayerConfig = this.dataStore.layerLookup.find((layerConfig) => layerConfig.layerId === layerId);
    currentLayerConfig.layer.setVisible(visible);
    currentLayerConfig.visible = visible;

    if (visible) {
      this.dataStore.visibleLayers = [currentLayerConfig, ...this.dataStore.visibleLayers];
    } else {
      this.dataStore.visibleLayers = this.dataStore.visibleLayers.filter(visibleLayerConfig => visibleLayerConfig !== currentLayerConfig);
    }
    this._visibleLayers.next(this.dataStore.visibleLayers);
    this._mapConfig.next(this.dataStore.mapConfig);
  }

  changeLayerOpacity(layerId: number, opacity: number) {
    const currentLayerConfig = this.dataStore.layerLookup.find((layerConfig) => layerConfig.layerId === layerId);
    currentLayerConfig.layer.setOpacity(opacity);
    currentLayerConfig.opacity = opacity;
  }

  reorderVisibleLayers(previousIndex: number, currentIndex: number) {
    moveItemInArray(this.dataStore.visibleLayers, previousIndex, currentIndex);
    this._visibleLayers.next(this.dataStore.visibleLayers);
  }

  ngOnDestroy() {
    if (this.featureInfoSubscription) {
      this.featureInfoSubscription.unsubscribe();
    }
  }

  showLegend(layerId: number) {
    const layerConfig = this.getLayerConfig(layerId);
    const legendLayerName = layerConfig.legendLayerName ? layerConfig.legendLayerName : layerConfig.layerName;
    const url = layerConfig.url +
      '?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' +
      legendLayerName;

    // &LEGEND_OPTIONS=dpi:180;bgColor:0xFF0000
    // console.log(url);
    this.showLegendSubject.next({ name: layerConfig.name, legendUrl: url });
  }

  hideLegend() {
    this.showLegendSubject.next(null);
  }

  private getLayerConfig(layerId: number): ILayerConfig {
    return this.dataStore.layerLookup.find((layerConfig) => layerConfig.layerId === layerId);
  }
}
