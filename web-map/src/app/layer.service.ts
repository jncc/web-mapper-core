import { Injectable } from '@angular/core';
import { ILayerConfig } from './models/layer-config.model';

import TileWMS from 'ol/source/tilewms';
import OSM from 'ol/source/osm';
import BingMaps from 'ol/source/bingmaps';
import Tile from 'ol/layer/tile';
import { AppConfigService } from './app-config.service';

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

  createBaseLayers(): Tile[] {
    const baseLayers = [];
    let baseLayer = new Tile({
      source: new OSM()
    });
    baseLayers.push(baseLayer);
    baseLayer = new Tile({
      source: new BingMaps({
        key: AppConfigService.settings.bingMapsApiKey,
        imagerySet: 'Aerial'
      })
    });
    baseLayer.setVisible(false);
    baseLayers.push(baseLayer);
    return baseLayers;
  }
}
