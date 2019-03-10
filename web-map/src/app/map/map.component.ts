import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

// TODO: remove unneeded imports
import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import Group from 'ol/layer/group';
import OSM from 'ol/source/osm';
import TileWMS from 'ol/source/tilewms';
import proj from 'ol/proj';
import OverviewMap from 'ol/control/overviewmap';
import ScaleLine from 'ol/control/scaleline';
import DragZoom from 'ol/interaction/dragzoom';
import MapBrowserEvent from 'ol/mapbrowserevent';
import MousePosition from 'ol/control/mouseposition';
import Collection from 'ol/collection';

import { MapService } from '../map.service';
import { ILayerConfig } from '../models/layer-config.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  map: Map;
  private dragZoomInSubscription: Subscription;
  private dragZoomOutSubscription: Subscription;
  private zoomSubscription: Subscription;
  private zoomToExtentSubscription: Subscription;
  private layersSubscription: Subscription;
  private baseLayersSubscription: Subscription;

  // Map defaults
  defaultCenter = [-2, 55];
  defaultZoom = 4;
  defaultBaseLayer = new Tile({
    source: new OSM()
  });

  private baseLayerGroup: Group;
  private layerGroup: Group;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.setupMap();
    this.layersSubscription = this.mapService.visibleLayers.subscribe(
      layers => this.updateLayers(layers)
    );
    this.baseLayersSubscription = this.mapService.baseLayers.subscribe(
      baseLayers => this.baseLayerGroup.setLayers(new Collection(baseLayers.map(layer => layer.layer)))
    );
  }

  private updateLayers(layersConfig: ILayerConfig[]): void {
    const layers = layersConfig.slice().reverse().map(layerConfig => layerConfig.layer);
    this.layerGroup.setLayers(new Collection(layers));
  }

  private setupMap() {
    this.baseLayerGroup = new Group();
    this.baseLayerGroup.setLayers(new Collection([this.defaultBaseLayer]));
    this.layerGroup = new Group();

    const view = new View({
      center: proj.fromLonLat([this.defaultCenter[0], this.defaultCenter[1]]),
      zoom: this.defaultZoom,
      maxZoom: 17,
      minZoom: 3
    });

    this.map = new Map({
      target: 'map',
      controls: [
        new OverviewMap({
          collapsed: false,
          collapsible: false,
          target: document.getElementById('overviewMap')
        }),
        new MousePosition({
          projection: 'EPSG:4326',
          target: document.getElementById('mousePosition'),
          className: 'custom-mouse-position',
          undefinedHTML: 'lol: -- lat: --',
          coordinateFormat: coordinate => 'lon: ' + coordinate[0].toFixed(3) + ' lat: ' + coordinate[1].toFixed(3)
        }),
        new ScaleLine({
          // target: document.getElementById('scaleLine'),
          // className: 'custom-scale-line'
        })
      ],
      layers: [
        this.baseLayerGroup,
        this.layerGroup
      ],
      view: view
    });

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
            const url = source.getGetFeatureInfoUrl(
              event.coordinate,
              viewResolution,
              'EPSG:3857',
              { 'INFO_FORMAT': 'text/html' }
            );
            urls.push(url);
          }
        }
      });
      this.mapService.showFeatureInfo(urls);
    });

    this.map.on('moveend', () => this.mapService.onMapMoveEnd(view.getZoom(), view.getCenter()));

    // this.map.on('pointermove', (event: MapBrowserEvent) => {
    //   console.log(proj.toLonLat(event.coordinate));
    // });


    // TODO: why can't ol.condition.always be used here as EventsConditionType?
    const dragZoomIn = new DragZoom({
      condition: () => true,
      out: false
    });
    this.map.addInteraction(dragZoomIn);
    dragZoomIn.setActive(false);
    this.dragZoomInSubscription = this.mapService.dragZoomInSubject.subscribe((active) => {
      dragZoomIn.setActive(true);
      dragZoomIn.on('boxend', () => dragZoomIn.setActive(false));
    });

    const dragZoomOut = new DragZoom({
      condition: () => true,
      out: true
    });
    this.map.addInteraction(dragZoomOut);
    dragZoomOut.setActive(false);
    this.dragZoomOutSubscription = this.mapService.dragZoomOutSubject.subscribe((active) => {
      dragZoomOut.setActive(true);
      dragZoomOut.on('boxend', () => dragZoomOut.setActive(false));
    });

    // this.map.on('pointerdrag', event => {
    //   document.body.style.cursor = 'grabbing';
    // });

    this.zoomSubscription = this.mapService.zoomSubject.subscribe(data => {
      if (data.center && data.center.length === 2 && data.zoom) {
        const center = proj.fromLonLat([data.center[0], data.center[1]]);
        view.animate({ center: center, zoom: data.zoom });
      } else {
        this.zoomToMapExtent();
      }
    });

    this.zoomToExtentSubscription = this.mapService.zoomToExtentSubject.subscribe(data => {
      const extent = proj.transformExtent([data[0], data[1], data[2], data[3]], 'EPSG:4326', 'EPSG:3857');
      view.fit(extent, { duration: 1000 });
    });
  }

  zoomToMapExtent() {
    this.map.getView().setCenter(proj.fromLonLat([this.defaultCenter[0], this.defaultCenter[1]]));
    this.map.getView().setZoom(this.defaultZoom);
  }

  ngOnDestroy() {
    if (this.dragZoomInSubscription) {
      this.dragZoomInSubscription.unsubscribe();
    }
    if (this.dragZoomOutSubscription) {
      this.dragZoomOutSubscription.unsubscribe();
    }
    if (this.zoomSubscription) {
      this.zoomSubscription.unsubscribe();
    }
    if (this.layersSubscription) {
      this.layersSubscription.unsubscribe();
    }
    if (this.zoomToExtentSubscription) {
      this.zoomToExtentSubscription.unsubscribe();
    }
    if (this.baseLayersSubscription) {
      this.baseLayersSubscription.unsubscribe();
    }
  }
}
