import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
import Attribution from 'ol/control/attribution';
import condition from 'ol/events/condition';

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
  private mapConfigSubscription: Subscription;

  // Map defaults
  defaultCenter = [-2, 55];
  defaultZoom = 4;
  defaultBaseLayer = new Tile({
    source: new OSM()
  });

  private baseLayerGroup: Group;
  private layerGroup: Group;
  private overviewMap: OverviewMap;

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.setupMap();
    this.layersSubscription = this.mapService.visibleLayers.subscribe(
      layers => this.updateLayers(layers)
    );
    this.baseLayersSubscription = this.mapService.baseLayers.subscribe(
      baseLayers => {
        const baseLayerCollection = new Collection(baseLayers.map(layer => layer.layer));
        this.baseLayerGroup.setLayers(baseLayerCollection);
        this.overviewMap = new OverviewMap({
          collapsed: false,
          collapsible: false,
          target: document.getElementById('overviewMap'),
          layers: baseLayerCollection
        });
        this.map.addControl(this.overviewMap);
      }
    );
    this.mapConfigSubscription = this.mapService.mapConfig.subscribe(
      mapConfig => {
        const maxZoom = mapConfig.mapInstance.maxZoom;
        if (maxZoom > 0) {
          this.map.getView().setMaxZoom(maxZoom);
        }
      }
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
        new MousePosition({
          projection: 'EPSG:4326',
          target: document.getElementById('mousePosition'),
          className: 'custom-mouse-position',
          undefinedHTML: 'lon: -- lat: --',
          coordinateFormat: coordinate => 'lon: ' + coordinate[0].toFixed(3) + ' lat: ' + coordinate[1].toFixed(3)
        }),
        new ScaleLine({
          target: document.getElementById('scaleLine'),
          // className: 'custom-scale-line'
        }),
        new Attribution({
          collapsible: false,
          // className: 'custom-attribution',
          target: document.getElementById('attribution')
        })
      ],
      layers: [
        this.baseLayerGroup,
        this.layerGroup
      ],
      view: view
    });

    this.mapService.mapReady(this.map);

    this.setupGetFeatureInfo();
    this.setupZoomSubscriptions(view);

    this.map.on('moveend', () => this.mapService.onMapMoveEnd(view.getZoom(), view.getCenter()));

    // this.map.on('pointermove', (event: MapBrowserEvent) => {
    //   console.log(proj.toLonLat(event.coordinate));
    // });
  }

  /**
   * Provides the URLs to the map service for getting feature info
   * Layers in the baseLayerGroup are excluded
   * forEachLayerAtPixel is provided with:
   *  the callback function, which gets the featureInfoUrl from the source
   *  this (not used),
   *  the layer filter (tile layer that isn't in baseLayerGroup)
   */
  setupGetFeatureInfo() {
    this.map.on('click', (event: MapBrowserEvent) => {
      const viewResolution = this.map.getView().getResolution();
      const pixel = this.map.getEventPixel(event.originalEvent);
      const urls = [];
      const baseLayerArray = this.baseLayerGroup.getLayers().getArray();
      this.map.forEachLayerAtPixel(pixel,
        layer => {
          const source = (<Tile>layer).getSource();
          if (source instanceof TileWMS) {
            const url = source.getGetFeatureInfoUrl(
              event.coordinate,
              viewResolution,
              'EPSG:3857',
              { 'INFO_FORMAT': 'text/html', 'feature_count': '50' }
            );
            urls.push(url);
          }
        },
        this,
        layer => layer instanceof Tile && baseLayerArray.indexOf(layer) === -1
      );
      this.mapService.showFeatureInfo(urls);
    });
  }

  /**
   * There are drag zooms in and out and zoom to centre and zoom level
   * Sets up the interactions and subscriptions to these Subjects in the map service
   *
   * @param view the map view
   */
  setupZoomSubscriptions(view: View) {
    const dragZoomIn = new DragZoom({
      condition: condition.always,
      out: false
    });
    this.map.addInteraction(dragZoomIn);
    dragZoomIn.setActive(false);
    this.dragZoomInSubscription = this.mapService.dragZoomInSubject.subscribe((active) => {
      dragZoomIn.setActive(true);
      dragZoomIn.on('boxend', () => dragZoomIn.setActive(false));
    });

    const dragZoomOut = new DragZoom({
      condition: condition.always,
      out: true
    });
    this.map.addInteraction(dragZoomOut);
    dragZoomOut.setActive(false);
    this.dragZoomOutSubscription = this.mapService.dragZoomOutSubject.subscribe((active) => {
      dragZoomOut.setActive(true);
      dragZoomOut.on('boxend', () => dragZoomOut.setActive(false));
    });

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
    if (this.mapConfigSubscription) {
      this.mapConfigSubscription.unsubscribe();
    }
  }
}
