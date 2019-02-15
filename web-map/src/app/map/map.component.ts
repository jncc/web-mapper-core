import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// TODO: remove unneeded imports
import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import Group from 'ol/layer/group';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import OSM from 'ol/source/osm';
import TileWMS from 'ol/source/tilewms';
import Image from 'ol/layer/image';
import ImageWMS from 'ol/source/imagewms';
import GeoJSON from 'ol/format/geojson';
import proj from 'ol/proj';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Select from 'ol/interaction/select';
import condition from 'ol/events/condition';
import OverviewMap from 'ol/control/overviewmap';
import ScaleLine from 'ol/control/scaleline';
import ImageLayer from 'ol/layer/image';
import DragZoom from 'ol/interaction/dragzoom';
import MapBrowserEvent from 'ol/mapbrowserevent';

import always from 'ol/events/condition';
import EventConditionType from 'ol';
import EventsConditionType from 'ol';

import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';
import { typeWithParameters } from '@angular/compiler/src/render3/util';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  map: Map;
  private zoomToMapExtentSubscription: Subscription;
  private zoomInToExtentSubscription: Subscription;
  private zoomOutToExtentSubscription: Subscription;
  private zoomSubscription: Subscription;

  private layersSubscription: Subscription;

  // mapExtent = proj.transformExtent([-4, 50, 1, 60], 'EPSG:4326', 'EPSG:3857');
  // TODO: read from config
  initialCenter = [-2, 55];
  initialZoom = 4;

  baseLayer = new Tile({
    source: new OSM()
  });

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.setupMap();
    this.layersSubscription = this.mapService.visibleLayers.subscribe(
      (layers) => this.updateLayers(layers)
    );
  }

  private updateLayers(layersConfig: ILayerConfig[]): void {
    // console.log(layersConfig);
    this.map.setLayerGroup(new Group());
    this.map.addLayer(this.baseLayer);
    layersConfig.slice().reverse().forEach(layerConfig => this.map.addLayer(layerConfig.layer));
  }

  private setupMap() {
    const view = new View({
      center: proj.fromLonLat([this.initialCenter[0], this.initialCenter[1]]),
      zoom: this.initialZoom,
      maxZoom: 17,
      minZoom: 3
    });

    this.map = new Map({
      target: 'map',
      controls: [
        new OverviewMap({
          collapsed: false,
          collapsible: false
        }),
        new ScaleLine()
      ],
      layers: [
        this.baseLayer
      ],
      view: view
    });
    // this.map.getView().fit(this.mapExtent);

    this.map.addInteraction(new DragZoom());

    this.mapService.mapReady(this.map);

    this.map.on('click', (event: MapBrowserEvent) => {
      const viewResolution = this.map.getView().getResolution();
      const pixel = this.map.getEventPixel(event.originalEvent);
      const urls = [];
      this.map.forEachLayerAtPixel(pixel, layer => {
        if (layer instanceof Tile) {
          const source = (<Tile>layer).getSource();
          if (source instanceof TileWMS) {
            const url = source.getGetFeatureInfoUrl(event.coordinate, viewResolution, 'EPSG:3857',
              { 'INFO_FORMAT': 'text/html' });
            // {'INFO_FORMAT': 'text/plain'});
            // {'INFO_FORMAT': 'application/json'});
            urls.push(url);
            // console.log(url);
          }
        }
      });
      this.mapService.showFeatureInfo(urls);
    });

    this.zoomToMapExtentSubscription = this.mapService.zoomMapExtent.subscribe(() => {
        this.map.getView().setCenter(proj.fromLonLat([this.initialCenter[0], this.initialCenter[1]]));
        this.map.getView().setZoom(this.initialZoom);
      }
    );

    // TODO: speak to SB about condition and EventsConditionType
    const dragZoomIn = new DragZoom({
      condition: () => true,
      out: false
    });
    this.map.addInteraction(dragZoomIn);
    dragZoomIn.setActive(false);
    this.zoomInToExtentSubscription = this.mapService.zoomInExtent.subscribe((active) => {
      dragZoomIn.setActive(active);
    });

    const dragZoomOut = new DragZoom({
      condition: () => true,
      out: true
    });
    this.map.addInteraction(dragZoomOut);
    dragZoomOut.setActive(false);
    this.zoomOutToExtentSubscription = this.mapService.zoomOutExtent.subscribe((active) => {
      dragZoomOut.setActive(active);
    });

    this.zoomSubscription = this.mapService.zoom.subscribe(data => {
      if (data.center && data.center.length === 2 && data.zoom) {
        const center = proj.fromLonLat([data.center[0], data.center[1]]);
        this.map.getView().setCenter(center);
        this.map.getView().setZoom(data.zoom);
      } else {

      }
    });
  }

  ngOnDestroy() {
    if (this.zoomToMapExtentSubscription) {
      this.zoomToMapExtentSubscription.unsubscribe();
    }
    if (this.zoomInToExtentSubscription) {
      this.zoomInToExtentSubscription.unsubscribe();
    }
    if (this.zoomOutToExtentSubscription) {
      this.zoomOutToExtentSubscription.unsubscribe();
    }
    if (this.zoomSubscription) {
      this.zoomSubscription.unsubscribe();
    }
    if (this.layersSubscription) {
      this.layersSubscription.unsubscribe();
    }
  }
}
