import { Injectable } from '@angular/core';
import { ILayerConfig } from './models/layer-config.model';

import TileWMS from 'ol/source/tilewms';
import OSM from 'ol/source/osm';
import BingMaps from 'ol/source/bingmaps';
import Tile from 'ol/layer/tile';
import XYZ from 'ol/source/xyz';
import WMSCapabilities from 'ol/format/wmscapabilities';

import { AppConfigService } from './app-config.service';
import { IBaseLayerConfig } from './models/base-layer-config.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor(private apiService: ApiService) { }

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

  getExternalLayers(url: string) {
    const capabilitiesUrl = url + '?SERVICE=wms&REQUEST=GetCapabilities&VERSION=1.3.0';
    this.apiService.getCapabilities(capabilitiesUrl).subscribe(data => {
      const parser = new WMSCapabilities();
      const capabilities = parser.read(data);
      const layers = capabilities.Capability.Layer.Layer;
      // console.log(layers);
      layers.forEach(layer => {
        console.log(layer.Name, layer.Title);
      });
      // console.log(capabilities);

      // const layer = result.Capability.Layer.Layer.find(l => l.Name === layerName);
      // if (layer.hasOwnProperty('Layer')) {
      //   console.log('I\'m a group layer');
      //   if (layer.Layer) {
      //     console.log(legendLayerName);
      //     console.log(layer.Layer);
      //     const layer2 = layer.Layer.find(l => l.Name === 'emodnet:' + legendLayerName);
      //     if (layer2.Style) {
      //       console.log(layer2.Style);
      //     }
      //     // console.log(layer2);
      //   }
      // } else {
      //   console.log('I\'m just a layer');
      // }
            // console.log(result.Capability.Layer.Layer.find(l => l.Name === layerName));
    });
  }
}
