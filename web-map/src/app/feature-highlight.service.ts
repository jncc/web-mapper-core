import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import { ILayerConfig } from './models/layer-config.model';
import { LayerService } from './layer.service';
import { BehaviorSubject } from 'rxjs';
import TileWMS from 'ol/source/tilewms';
import { IHighlightInfo } from './models/highlight-info.model';


@Injectable({
  providedIn: 'root'
})
export class FeatureHighlightService {
  private highlightLayerSourceSubject = new BehaviorSubject<TileWMS>(null);
  highlightLayerSource$ = this.highlightLayerSourceSubject.asObservable();

  visibleLayers: ILayerConfig[];

  constructor() { }

  highlightFeature(highlightInfo: IHighlightInfo) {
    this.highlightLayerSourceSubject.next(null);
    if (highlightInfo) {
      const coordinate = highlightInfo.coordinate;
      const highlightedLayer = highlightInfo.highlightedLayer;

      const params = { ...highlightInfo.highlightedLayer.layer.getSource().getParams() };
      let cqlFilter = params.CQL_FILTER;

      if (cqlFilter) {
        cqlFilter += ` AND INTERSECTS(geom, SRID=3857;POINT(${coordinate[0]} ${coordinate[1]}))`;
      } else {
        cqlFilter = `INTERSECTS(geom, SRID=3857;POINT(${coordinate[0]} ${coordinate[1]}))`;
      }

      const source = new TileWMS({
        url: highlightedLayer.url,
        params: {
          'LAYERS': highlightedLayer.layerName, // TODO + _highlight
          'TILED': 'TRUE',
          'FORMAT': 'image/png8',
          'CQL_FILTER': cqlFilter,
          'viewParams': params.viewParams
        },
        crossOrigin: 'anonymous'
      });
      this.highlightLayerSourceSubject.next(source);
    }
  }
}
