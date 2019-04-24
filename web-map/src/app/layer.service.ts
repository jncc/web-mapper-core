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

  layerId = 999;
  layerGroupId = 999;

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

  createBaseLayers(baseLayerConfigs?: IBaseLayerConfig[]): IBaseLayer[] {
    const baseLayers: IBaseLayer[] = [];

    // OpenStreetMap
    let layer = new Tile({
      visible: false,
      source: new OSM()
    });
    let baseLayer: IBaseLayer = {
      baseLayerId: -3,
      name: 'OpenStreetMap',
      layer: layer
    };
    baseLayers.push(baseLayer);

    // Bing Maps
    layer = new Tile({
      visible: true,
      source: new BingMaps({
        key: AppConfigService.settings.bingMapsApiKey,
        imagerySet: 'AerialWithLabels'
      })
    });
    baseLayer = {
      baseLayerId: -2,
      name: 'Bing Maps',
      layer: layer
    };
    baseLayers.push(baseLayer);

    // OpenTopoMap
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

    if (baseLayerConfigs) {
      baseLayerConfigs.forEach(baseLayerConfig => {
        layer = this.createBaseLayer(baseLayerConfig);

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

  getExternalLayers(url: string): Observable<ILayerGroupConfig> {
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
