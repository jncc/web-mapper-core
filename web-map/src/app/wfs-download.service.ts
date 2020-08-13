import { Injectable } from '@angular/core';
import { FeatureHighlightService } from './feature-highlight.service';
import { ILayerConfig } from './models/layer-config.model';
import Feature from 'ol/feature';
import WFS from 'ol/format/wfs';
import filter from 'ol/format/filter';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class WfsDownloadService {

  constructor(
    private httpClient: HttpClient
  ) { }

  download(feature: Feature, layerConfig: ILayerConfig) {
    const geometry = feature.getGeometry();
    // https://gis.stackexchange.com/a/104568/207
    // you can't use WFS on a group layer so use the downloadLayer config
    const featureRequest = new WFS().writeGetFeature({
      srsName: 'EPSG:3857',
      // featureNS: 'emodnet',
      // featurePrefix: 'emodnet',
      // featureTypes: ['eusm2016_msfd_full'],
      featureNS: '',
      featurePrefix: '',
      featureTypes: [layerConfig.downloadLayer],
      outputFormat: 'shape-zip',
      filter: filter.intersects('geom', geometry, 'EPSG:3857')
    });

    const wfsRequestUrl = layerConfig.url.substring(0, layerConfig.url.length - 3) + 'wfs';
    // + '?format_options=filename:test.zip';

    this.httpClient.post(
      wfsRequestUrl,
      // '//jnccdev-geo.esdm.co.uk/geoserver/wfs',
      new XMLSerializer().serializeToString(featureRequest),
      { responseType: 'blob' }
    ).subscribe(response => this.processDownload(response));
  }


  private processDownload(response: any) {
    const blob = new Blob([response], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }
}
