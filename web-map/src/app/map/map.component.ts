import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import Vector from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import Feature from 'ol/feature';
import DragBox from 'ol/interaction/dragbox';
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
import Polygon from 'ol/geom/polygon';

import { MapService } from '../map.service';
import { FeatureHighlightService } from '../feature-highlight.service';
import { MeasureService } from '../measure.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  map: Map;
  private view: View;

  private subscription = new Subscription();

  // Map defaults
  defaultCenter = [-2, 55];
  defaultZoom = 4;
  defaultBaseLayer = new Tile({
    source: new OSM()
  });

  private baseLayerGroup: Group;
  private layerGroup: Group;
  private highlightLayer: Tile;
  private overviewMap: OverviewMap;

  // bbox download
  private bboxLayer: Vector;
  private bbox: number[];
  private downloadLayerId: number;


  constructor(
    private mapService: MapService,
    private measureService: MeasureService,
    private featureHighlightService: FeatureHighlightService
  ) { }

  ngOnInit() {
    this.setupMap();
    this.subscription.add(this.subscribeToLayers());
    this.subscription.add(this.subscribeToBaseLayers());
    this.subscription.add(this.subscribeToMapConfig());
    this.subscription.add(this.subscribeToHighlightLayerSource());
    this.subscription.add(this.subscribeToBbox());
    this.subscription.add(this.subscribeToMeasure());
  }


  // when measuring distances/areas remove the feature info click
  // re-add it when measuring has stopped.
  private subscribeToMeasure(): Subscription {
    return this.measureService.measuring$.subscribe(
      measuring => {
        if (measuring) {
          this.removeFeatureInfoClick();
        } else {
          this.addFeatureInfoClick();
        }
      }
    );
  }

  private subscribeToMapConfig(): Subscription {
    return this.mapService.mapConfig.subscribe(
      mapConfig => {
        const maxZoom = mapConfig.mapInstance.maxZoom;
        if (maxZoom > 0) {
          this.view.setMaxZoom(maxZoom);
        }
      }
    );
  }

  private subscribeToBaseLayers(): Subscription {
    return this.mapService.baseLayers.subscribe(
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
  }

  private subscribeToLayers(): Subscription {
    return this.mapService.visibleLayers.subscribe(layersConfig => {
      const layers = layersConfig.slice().reverse().map(layerConfig => layerConfig.layer);
      this.layerGroup.setLayers(new Collection(layers));
    });
  }

  private subscribeToHighlightLayerSource(): Subscription {
    return this.featureHighlightService.highlightLayerSource$.subscribe(source => {
      this.highlightLayer.setVisible(false);
      this.highlightLayer.setSource(source);
      if (source) {
        this.highlightLayer.setVisible(true);
      }
    });
  }

  private setupMap() {
    this.baseLayerGroup = new Group();
    this.baseLayerGroup.setLayers(new Collection([this.defaultBaseLayer]));
    this.layerGroup = new Group();

    this.view = new View({
      center: proj.fromLonLat([this.defaultCenter[0], this.defaultCenter[1]]),
      zoom: this.defaultZoom,
      maxZoom: 17,
      minZoom: 3
    });

    this.highlightLayer = new Tile();

    this.setupBboxLayer();

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
        this.layerGroup,
        this.highlightLayer,
        this.bboxLayer
      ],
      view: this.view
    });

    this.mapService.mapReady(this.map);

    this.addFeatureInfoClick();
    this.setupZoomSubscriptions();
  }

  private addFeatureInfoClick() {
    this.map.on('click', this.onGetFeatureInfo);
  }

  private removeFeatureInfoClick() {
    this.map.un('click', this.onGetFeatureInfo);
  }

  /**
   * Provides the URLs to the map service for getting feature info
   * Layers in the baseLayerGroup are excluded
   * forEachLayerAtPixel is provided with:
   *  the callback function, which gets the featureInfoUrl from the source
   *  this (not used),
   *  the layer filter (tile layer that isn't in baseLayerGroup)
   */
  private onGetFeatureInfo = (event: MapBrowserEvent) => {
      const viewResolution = this.view.getResolution();
      const pixel = this.map.getEventPixel(event.originalEvent);
      const urls = [];
      const baseLayerArray = this.baseLayerGroup.getLayers().getArray();

      const layerIds: number[] = [];
      const coordinate = event.coordinate;

      this.map.forEachLayerAtPixel(pixel,
        layer => {
          layerIds.push(layer.get('layerId'));
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
        layer => layer instanceof Tile && layer !== this.highlightLayer && baseLayerArray.indexOf(layer) === -1
      );
      this.mapService.showFeatureInfo(urls, coordinate, layerIds);
  }

  /**
   * There are drag zooms in and out and zoom to centre and zoom level
   * Sets up the interactions and subscriptions to these Subjects in the map service
   *
   */
  setupZoomSubscriptions() {
    this.subscription.add(this.subscribeToZoomIn());
    this.subscription.add(this.subscribeToZoomOut());
    this.subscription.add(this.subscribeToDragZoomIn());
    this.subscription.add(this.subscribeToDragZoomOut());
    this.subscription.add(this.subscribeToZoom());
    this.subscription.add(this.subscribeToZoomToExtent());
  }

  private subscribeToZoomIn(): Subscription {
    return this.mapService.zoomInSubject.subscribe(() => this.view.setZoom(this.view.getZoom() + 1));
  }

  private subscribeToZoomOut(): Subscription {
    return this.mapService.zoomOutSubject.subscribe(() => this.view.setZoom(this.view.getZoom() - 1));
  }

  private subscribeToDragZoomIn(): Subscription {
    const dragZoomIn = new DragZoom({
      condition: condition.always,
      out: false
    });
    this.map.addInteraction(dragZoomIn);
    dragZoomIn.setActive(false);

    return this.mapService.dragZoomInSubject.subscribe((active) => {
      dragZoomIn.setActive(true);
      dragZoomIn.on('boxend', () => dragZoomIn.setActive(false));
    });
  }

  private subscribeToDragZoomOut(): Subscription {
    const dragZoomOut = new DragZoom({
      condition: condition.always,
      out: true
    });
    this.map.addInteraction(dragZoomOut);
    dragZoomOut.setActive(false);

    return this.mapService.dragZoomOutSubject.subscribe((active) => {
      dragZoomOut.setActive(true);
      dragZoomOut.on('boxend', () => dragZoomOut.setActive(false));
    });
  }

  private subscribeToZoom(): Subscription {
    return this.mapService.zoomSubject.subscribe(data => {
      if (data.center && data.center.length === 2 && data.zoom) {
        const center = proj.fromLonLat([data.center[0], data.center[1]]);
        this.view.animate({ center: center, zoom: data.zoom });
      } else {
        this.zoomToMapExtent();
      }
    });
  }

  private subscribeToZoomToExtent(): Subscription {
    return this.mapService.zoomToExtentSubject.subscribe(data => {
      const extent = proj.transformExtent([data[0], data[1], data[2], data[3]], 'EPSG:4326', 'EPSG:3857');
      this.view.fit(extent, { duration: 1000 });
    });
  }

  zoomToMapExtent() {
    this.view.setCenter(proj.fromLonLat([this.defaultCenter[0], this.defaultCenter[1]]));
    this.view.setZoom(this.defaultZoom);
  }

  private setupBboxLayer(): void {
    this.bboxLayer = new Vector({
      source: new VectorSource({wrapX: false})
    });
  }

  private subscribeToBbox(): Subscription {
    return this.mapService.bboxSubject.subscribe( layerId => {
      this.downloadLayerId = layerId;
      const dragBox = new DragBox();
      this.map.addInteraction(dragBox);
      dragBox.on('boxend', (event: MapBrowserEvent) => this.onBoxEnd(event));
      dragBox.on('boxstart', (event: MapBrowserEvent) => this.onBoxStart(event));
      // console.log('download by bbox ' + layerId);
    });
  }

  private onBoxStart(event: MapBrowserEvent) {
    // console.log(event.coordinate)
    this.bbox = [];
    this.bbox.push(event.coordinate[0], event.coordinate[1]);
  }

  private onBoxEnd(event: MapBrowserEvent) {
    // console.log(event.coordinate)
    this.bbox.push(event.coordinate[0], event.coordinate[1]);
    // console.log(this.bbox)
    const geometry = this.polygonFromBbox(this.bbox);
    const feature = new Feature(geometry);
    this.bboxLayer.setSource(new VectorSource({features: [feature]}));
    this.mapService.onDownloadBboxComplete(feature, this.downloadLayerId);
    // TODO - prompt user to ok/cancel for download
    // TODO - do the download
  }

  private polygonFromBbox(bbox: number[]) {
    const coordinatesArray: [number, number][][] = [[
      [bbox[0], bbox[1]],
      [bbox[2], bbox[1]],
      [bbox[2], bbox[3]],
      [bbox[0], bbox[3]],
      [bbox[0], bbox[1]]
    ]];
    return new Polygon(coordinatesArray);
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
