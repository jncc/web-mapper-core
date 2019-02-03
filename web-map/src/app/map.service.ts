import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { IMapConfig } from './models/map-config.model';

// TODO: move to another service
import TileWMS from 'ol/source/tilewms';
import Tile from 'ol/layer/tile';
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
      mapConfig: { mapInstances: [] }
    };
    this._mapConfig = <BehaviorSubject<IMapConfig>>new BehaviorSubject(this.dataStore.mapConfig);
    this.apiService.getConfig().subscribe((data) => {
      this.dataStore.mapConfig = data;
      // TODO: move to another service
      this.createLayersForConfig();
      // console.log(this.dataStore.mapConfig);
      this._mapConfig.next(this.dataStore.mapConfig);
    }, error => console.log('Could not load map config.'));

    this.getMapInstanceConfig();
  }

  getMapInstanceConfig() {
    this.apiService.getMapInstanceConfig();
  }

  // TODO: move to another service
  private createLayersForConfig(): void {
    this.dataStore.mapConfig.mapInstances[0].layers.forEach((layerConfig) => {
      const source = new TileWMS({
        url: layerConfig.url,
        params: {'LAYERS': layerConfig.name}
      });
      layerConfig.layer = new Tile({
        source: source
      });
      layerConfig.layer.setOpacity(layerConfig.opacity);
      layerConfig.layer.setVisible(layerConfig.visible);
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

  changeLayerVisibility(layerId, visible) {
    const layerConfig = this.dataStore.mapConfig.mapInstances[0].layers.find((l) => l.id === layerId);
    if (layerConfig) {
      layerConfig.visible = visible;
      layerConfig.layer.setVisible(visible);
    }
  }
}
