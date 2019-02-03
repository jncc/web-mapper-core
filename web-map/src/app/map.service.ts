import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { IMapConfig } from './models/map-config.model';

// TODO: move to another service
import TileWMS from 'ol/source/tilewms';
import Tile from 'ol/layer/tile';
import { ILayerConfig } from './models/layer-config.model';
@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: any;

  zoomExtent = new Subject<null>();

  private dataStore: {
    mapConfig: IMapConfig;
  };

  private _mapConfig: BehaviorSubject<IMapConfig>;
  get mapConfig() {
    return this._mapConfig.asObservable();
  }

  constructor(private http: HttpClient, private apiService: ApiService) {
    this.dataStore = {
      mapConfig: {
        mapInstances: [],
        mapInstance: {
          name: '',
          description: '',
          layerGroups: []
        }
      }
    };
    this._mapConfig = <BehaviorSubject<IMapConfig>>new BehaviorSubject(this.dataStore.mapConfig);

    this.subscribeToConfig();

    this.subscribeToMapInstanceConfig();
  }

  private subscribeToConfig() {
    this.apiService.getConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstances = data.mapInstances;
      this._mapConfig.next(this.dataStore.mapConfig);
    }, error => console.log('Could not load map config.'));
  }

  private subscribeToMapInstanceConfig() {
    this.apiService.getMapInstanceConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstance = data;
      // TODO: move to another service
      this.createLayersForConfig();
      this._mapConfig.next(this.dataStore.mapConfig);
    }, error => console.log('Could not load map instance config.'));
  }

  // TODO: move to another service
  private createLayersForConfig(): void {
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach((layerGroupConfig) => {
      if (layerGroupConfig.layers.length) {
        layerGroupConfig.layers.forEach((layerConfig: ILayerConfig) => {
          const source = new TileWMS({
            url: layerConfig.url,
            params: { 'LAYERS': layerConfig.name }
          });
          layerConfig.layer = new Tile({
            source: source
          });
          layerConfig.layer.setOpacity(layerConfig.opacity);
          layerConfig.layer.setVisible(layerConfig.visible);
        });
      }
    });
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

  changeLayerVisibility(layerId: number, visible: boolean) {
    // const layerConfig = this.dataStore.mapConfig.mapInstance.layers.find((l) => l.layerId === layerId);
    const layers = this.dataStore.mapConfig.mapInstance.layerGroups
      .map((layerGroup) => layerGroup.layers)
      .reduce((a, b) => a.concat(b));
    const layerConfig = layers.find((l) => l.layerId === layerId);
    if (layerConfig) {
      layerConfig.visible = visible;
      layerConfig.layer.setVisible(visible);
    }
  }
}
