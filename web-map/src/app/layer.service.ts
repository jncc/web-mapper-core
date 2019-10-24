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
import { ILayerGroupConfig } from './models/layer-group-config';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IBaseLayer } from './models/base-layer.model';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  layerId: number;
  layerGroupId: number;
  defaultBaseLayer = 'Bing';

  constructor(private apiService: ApiService) {
    this.defaultBaseLayer = AppConfigService.settings.defaultBaseLayer;
   }

  createLayer(layerConfig: ILayerConfig, format = 'image/png8'): Tile {
    const source = new TileWMS({
      url: layerConfig.url,
      params: {
        'LAYERS': layerConfig.layerName,
        'TILED': 'TRUE',
        'FORMAT': format,
      },
      crossOrigin: 'anonymous'
    });
    const layer = new Tile({
      source: source
    });
    return layer;
  }

  createBaseLayers(baseLayerConfigs?: IBaseLayerConfig[]): IBaseLayer[] {
    const baseLayers: IBaseLayer[] = [];

    // OpenStreetMap
    const osmLayer = new Tile({
      visible: false,
      source: new OSM()
    });
    let baseLayer: IBaseLayer = {
      baseLayerId: -3,
      name: 'OpenStreetMap',
      layer: osmLayer
    };
    baseLayers.push(baseLayer);

    // Bing Maps
    const bingLayer = new Tile({
      visible: false,
      source: new BingMaps({
        key: AppConfigService.settings.bingMapsApiKey,
        imagerySet: 'Aerial'
      })
    });
    baseLayer = {
      baseLayerId: -2,
      name: 'Bing Maps',
      layer: bingLayer
    };
    baseLayers.push(baseLayer);

    if (this.defaultBaseLayer === 'OSM') {
      osmLayer.setVisible(true);
    } else {
      bingLayer.setVisible(true);
    }

    // OpenTopoMap
    /*
    layer = new Tile({
      visible: false,
      source: new XYZ({
        url: '//{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
      })
    });
    baseLayer = {
      baseLayerId: -1,
      name: 'OpenTopoMap',
      layer: layer
    };
    baseLayers.push(baseLayer);
    */

    if (baseLayerConfigs) {
      baseLayerConfigs.forEach(baseLayerConfig => {
        const layer = this.createBaseLayer(baseLayerConfig);

        if (baseLayerConfig.visible === true) {
          layer.setVisible(true);
          baseLayers.forEach(bl => bl.layer.setVisible(false));
        }
        baseLayer = {
          baseLayerId: baseLayerConfig.baseLayerId,
          name: baseLayerConfig.name,
          layer: layer
        };
        baseLayers.push(baseLayer);
      });
    }

    return baseLayers;
  }

  createBaseLayer(baseLayerConfig: IBaseLayerConfig): Tile {
    let attribution = baseLayerConfig.attribution;
    if (baseLayerConfig.attributionUrl) {
      attribution = `<a href="${baseLayerConfig.attributionUrl}" target="_blank">${baseLayerConfig.attribution}</a>`;
    }
    const source = new TileWMS({
      url: baseLayerConfig.url,
      attributions: [attribution],
      params: {
        'LAYERS': baseLayerConfig.layerName,
        'TILED': 'TRUE',
        'FORMAT': 'image/png8',
      },
      crossOrigin: 'anonymous'
    });
    const layer = new Tile({
      visible: false,
      source: source
    });
    return layer;
  }

  getExternalLayers(url: string, maxLayerId: number, maxLayerGroupId: number): Observable<ILayerGroupConfig> {
    this.layerId = maxLayerId;
    this.layerGroupId = maxLayerGroupId;
    const capabilitiesUrl = url + '?SERVICE=wms&REQUEST=GetCapabilities&VERSION=1.3.0';
    return this.apiService.getCapabilities(capabilitiesUrl).pipe(
      catchError(error => { console.error('error returned from this address'); return of(null); }),
      map(data => this.parseCapabilities(url, data))
    );
  }

  private parseCapabilities(url: string, data: any): ILayerGroupConfig {
    if (data === null) {
      console.error('no data returned from wms capabilities from this address');
      // an 'empty' layer group
      return {
        layerGroupId: null,
        name: null,
        layers: [],
        subLayerGroups: [],
        isExternal: true
      };
    } else {
      const parser = new WMSCapabilities();
      const capabilities = parser.read(data);
      const title = capabilities.Capability.Layer.Title;
      const layers = capabilities.Capability.Layer.Layer;
      const layerConfigs: ILayerConfig[] = [];
      layers.forEach(layer => {
        this.layerId += 1;
        layerConfigs.push(
          {
            layerId: this.layerId,
            layerName: layer.Name,
            name: layer.Title,
            url: url,
            order: this.layerId,
            defaultOrder: 0,
            visible: false,
            opacity: 1,
            layer: null,
            subLayerGroup: null,
            center: null,
            zoom: null,
            extent: layer.EX_GeographicBoundingBox,
            metadataUrl: null,
            downloadURL: null,
            legendLayerName: null,
            filters: null,
            metadataDescription: null
          }
        );
      });
      layerConfigs.forEach(layerConfig => this.createLayer(layerConfig));
      this.layerGroupId += 1;
      const layerGroupConfig = {
        layerGroupId: this.layerGroupId,
        name: title,
        layers: layerConfigs,
        subLayerGroups: [],
        isExternal: true
      };
      return layerGroupConfig;
    }
  }
}
