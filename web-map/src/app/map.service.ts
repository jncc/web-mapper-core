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


@Injectable({
  providedIn: 'root'
})
export class MapService implements OnDestroy {

  map: any;

  zoomExtent = new Subject<null>();

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
          layerGroups: []
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
      this.createMapInstanceConfig();
      // TODO: move to another service
      this.createLayersForConfig();
      this._mapConfig.next(this.dataStore.mapConfig);
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

  mapReady(map: any) {
    this.map = map;
  }

  zoomIn() {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }

  zoomout() {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }

  zoomToExtent() {
    this.zoomExtent.next();
  }

  getFeatureInfo() {
    const url = 'https://jnccdev-geo.esdm.co.uk/emodnet/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=info_format=text/plain&LAYERS=eusm_sub&QUERY_LAYERS=eusm_sub&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&X=100&Y=100&BBOX=-156543.03392804042%2C7357522.594617926%2C5.529727786779404e-10%2C7514065.628545967';
    // const url = 'https://ows.emodnet-seabedhabitats.eu/emodnet/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=info_format=text/plain&LAYERS=eusm_sub&QUERY_LAYERS=eusm_sub&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&X=100&Y=100&BBOX=-156543.03392804042%2C7357522.594617926%2C5.529727786779404e-10%2C7514065.628545967';
    this.http.get(url, { responseType: 'text' }).toPromise().then(
      data => {
        alert(data);
      }
    );
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

  reorderVisibleLayers(previousIndex: number, currentIndex: number) {
    moveItemInArray(this.dataStore.visibleLayers, previousIndex, currentIndex);
    this._visibleLayers.next(this.dataStore.visibleLayers);
  }

  ngOnDestroy() {
    if (this.featureInfoSubscription) {
      this.featureInfoSubscription.unsubscribe();
    }
  }
}
