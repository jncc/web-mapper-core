import { Injectable } from '@angular/core';
import { ILayerConfig } from './models/layer-config.model';

import TileWMS from 'ol/source/tilewms';
import OSM from 'ol/source/osm';
import BingMaps from 'ol/source/bingmaps';
import Tile from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import { AppConfigService } from './app-config.service';
import { IBaseLayerConfig } from './models/base-layer-config.model';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor() { }

  createLayer(layerConfig: ILayerConfig): Tile {
    const source = new TileWMS({
      url: layerConfig.url,
      params: {
        'LAYERS': layerConfig.layerName,
        'TILED': 'TRUE',
        'FORMAT': 'image/png8',
      },
      crossOrigin: 'anonymous'
    });
    const layer = new Tile({
      source: source
    });
    return layer;
  }

  createBaseLayers(): IBaseLayerConfig[] {
    const baseLayers: IBaseLayerConfig[] = [];

    // OpenStreetMap
    let layer = new Tile({
      source: new OSM()
    });
    let baseLayerConfig: IBaseLayerConfig = {
      baseLayerId: 1,
      name: 'OpenStreetMap',
      layer: layer
    };
    baseLayers.push(baseLayerConfig);

    // Bing Maps
    layer = new Tile({
      visible: false,
      source: new BingMaps({
        key: AppConfigService.settings.bingMapsApiKey,
        imagerySet: 'Aerial'
      })
    });
    baseLayerConfig = {
      baseLayerId: 2,
      name: 'Bing Maps',
      layer: layer
    };
    baseLayers.push(baseLayerConfig);

    // OpenTopoMap
    layer = new Tile({
      visible: false,
      source: new XYZ({
        url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
      })
    });
    baseLayerConfig = {
      baseLayerId: 3,
      name: 'OpenTopoMap',
      layer: layer
    };
    baseLayers.push(baseLayerConfig);

    return baseLayers;
  }
}
