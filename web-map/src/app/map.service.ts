import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { moveItemInArray } from '@angular/cdk/drag-drop';

import { ApiService } from './api.service';
import { IMapConfig } from './models/map-config.model';

import { ILayerConfig } from './models/layer-config.model';
import { ILayerGroupConfig } from './models/layer-group-config';
import { ISubLayerGroupConfig } from './models/sub-layer-group-config';
import { ILookup } from './models/lookup.model';
import { LayerService } from './layer.service';
import { PermalinkService } from './permalink.service';
import { IActiveFilter } from './models/active-filter.model';
import { IPermalink } from './models/permalink.model';
import { FilterService } from './filter.service';
import { IBaseLayer } from './models/base-layer.model';

import { IDictionary } from './models/dictionary.model';
import { IHighlightInfo } from './models/highlight-info.model';
import { FeatureHighlightService } from './feature-highlight.service';
import Feature from 'ol/feature';
import { WfsDownloadService } from './wfs-download.service';
import olMap from 'ol/map'; // rename the default export

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnDestroy {

  map: olMap;

  mapSubject = new BehaviorSubject<olMap>(null);

  zoomInSubject = new Subject<void>();
  zoomOutSubject = new Subject<void>();
  dragZoomInSubject = new Subject<void>();
  dragZoomOutSubject = new Subject<void>();
  zoomSubject = new Subject<{ center: number[], zoom: number }>();
  zoomToExtentSubject = new Subject<number[]>();

  showLegendSubject = new Subject<{ name: string, legendUrl: string }>();

  bboxSubject = new Subject<number>();

  private dataStore: {
    mapConfig: IMapConfig;
    layerLookup: ILayerConfig[];
    visibleLayers: ILayerConfig[];
    baseLayers: IBaseLayer[];
    featureInfos: any[];
    highlightInfo: IHighlightInfo;
    filterLookups: { [lookupCategory: string]: ILookup[]; };
    activeFilters: IActiveFilter[];
  } = {
    mapConfig: {
      mapInstances: [],
      mapInstance: {
        attribution: '',
        baseLayers: [],
        name: '',
        description: '',
        layerGroups: [],
        center: [],
        zoom: 0,
        externalWmsUrls: [],
        maxZoom: 20,
        allowLayerHighlight: false
      }
    },
    layerLookup: [],
    visibleLayers: [],
    baseLayers: [],
    featureInfos: [],
    highlightInfo: null,
    filterLookups: {},
    activeFilters: []
  };

  private _mapConfig: BehaviorSubject<IMapConfig>;
  get mapConfig() {
    return this._mapConfig.asObservable();
  }

  private _visibleLayers: BehaviorSubject<ILayerConfig[]>;
  get visibleLayers() {
    return this._visibleLayers.asObservable();
  }

  private _featureInfos: BehaviorSubject<any[]>;
  get featureInfos() {
    return this._featureInfos.asObservable();
  }
  private featureInfoSubscription: Subscription;

  private _filterLookups: BehaviorSubject<{ [lookupCategory: string]: ILookup[]; }>;
  get lookups() {
    return this._filterLookups.asObservable();
  }

  private _baseLayers: BehaviorSubject<IBaseLayer[]>;
  get baseLayers() {
    return this._baseLayers.asObservable();
  }

  private _activeFilters: BehaviorSubject<IActiveFilter[]>;
  get activeFilters() {
    return this._activeFilters.asObservable();
  }

  get maxLayerId(): number {
    return  this.dataStore.layerLookup.
    reduce((max: number, layerConfig: ILayerConfig) => layerConfig.layerId > max ? layerConfig.layerId : max, 0);
  }

  get maxLayerGroupId(): number {
    return this.dataStore.mapConfig.mapInstance.layerGroups.
      // tslint:disable-next-line:max-line-length
      reduce((max: number, layerGroupConfig: ILayerGroupConfig) => layerGroupConfig.layerGroupId > max ? layerGroupConfig.layerGroupId : max, 0);
  }

  constructor(
    private apiService: ApiService,
    private layerService: LayerService,
    private permalinkService: PermalinkService,
    private filterService: FilterService,
    private featureHighlightService: FeatureHighlightService,
    private wfsDownloadService: WfsDownloadService
  ) {
    this._mapConfig = <BehaviorSubject<IMapConfig>>new BehaviorSubject(this.dataStore.mapConfig);
    this._visibleLayers = <BehaviorSubject<ILayerConfig[]>>new BehaviorSubject(this.dataStore.visibleLayers);
    this._featureInfos = <BehaviorSubject<any[]>>new BehaviorSubject(this.dataStore.featureInfos);
    this._filterLookups = new BehaviorSubject({});
    this._baseLayers = new BehaviorSubject(this.dataStore.baseLayers);
    this._activeFilters = new BehaviorSubject(this.dataStore.activeFilters);
    // this.subscribeToConfig();
    this.createBaseLayers();
    this.subscribeToMapInstanceConfig();
  }

  private subscribeToConfig() {
    this.apiService.getConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstances = data;
      this._mapConfig.next(this.dataStore.mapConfig);
    }, error => console.error('Could not load map config from API.'));
  }

  private subscribeToMapInstanceConfig() {
    this.apiService.getMapInstanceConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstance = data;
      console.log(this.dataStore.mapConfig.mapInstance);
      this.createMapInstanceConfig();
      this.createLayersForConfig();
      this.createBaseLayers();
      this._mapConfig.next(this.dataStore.mapConfig);
      this.createFilterLookups();
    }, error => console.error('Could not load map instance config from API.'));
  }

  // transform map instance config received from api into hierarchy of layergroups, sublayergroups, layers
  private createMapInstanceConfig() {
    // sort layer groups by config values
    this.dataStore.mapConfig.mapInstance.layerGroups.sort((a, b) => a.order - b.order);
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach((layerGroupConfig: ILayerGroupConfig) => {
      this.createSubLayerGroups(layerGroupConfig);
    });
  }

  private createSubLayerGroups(layerGroupConfig: ILayerGroupConfig) {
    // get all sublayergroups in the layer group config
    const subLayerGroups: ISubLayerGroupConfig[] = layerGroupConfig.layers.
      map((layer) => layer.subLayerGroup).
      reduce((a: ISubLayerGroupConfig[], subLayerGroup, index) => {
        if (!a.find((slg) => subLayerGroup === slg.name)) {
          a.push({ name: subLayerGroup, layers: [], sublayerGroupId: index });
        }
        return a;
      }, []);
    // add the layers to the sub layer groups
    layerGroupConfig.layers.forEach((layerConfig) => {
      const subLayerGroup = subLayerGroups.find((slg) => slg.name === layerConfig.subLayerGroup);
      subLayerGroup.layers.push(layerConfig);
    });
    // sort the sub layer groups by the minimum value of their layer orders
    // note the layers within sub layer groups are ordered by a pipe in the sub-layer-group component template
    layerGroupConfig.subLayerGroups = subLayerGroups.sort((a, b) => {
      const minA: number = a.layers.
        reduce((min: number, layerConfig: ILayerConfig) => layerConfig.order < min ? layerConfig.order : min, a.layers[0].order);
      const minB: number = b.layers.
        reduce((min: number, layerConfig: ILayerConfig) => layerConfig.order < min ? layerConfig.order : min, b.layers[0].order);
      return minA - minB;
    });
  }

  private createLayersForConfig(): void {
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach(layerGroupConfig => {
      this.createLayersForLayerGroupConfig(layerGroupConfig);
    });
    // feature: sort layers by defaultOrder on config load
    this.dataStore.visibleLayers.sort((a, b) => a.defaultOrder - b.defaultOrder);
    this._visibleLayers.next(this.dataStore.visibleLayers);
  }

  private createLayersForLayerGroupConfig(layerGroupConfig: ILayerGroupConfig, format = 'image/png8') {
    if (layerGroupConfig.layers.length) {
      layerGroupConfig.layers.forEach((layerConfig: ILayerConfig) => {
        layerConfig.layer = this.layerService.createLayer(layerConfig, format);
        layerConfig.layer.setOpacity(layerConfig.opacity);
        layerConfig.layer.setVisible(layerConfig.visible);

        if (layerConfig.visible) {
          this.dataStore.visibleLayers = [layerConfig, ...this.dataStore.visibleLayers];
        }
        this.dataStore.layerLookup.push(layerConfig);
      });
    }
  }

  private createBaseLayers(): void {
    this.dataStore.baseLayers = this.layerService.createBaseLayers(this.dataStore.mapConfig.mapInstance.baseLayers);
    this._baseLayers.next(this.dataStore.baseLayers);
  }

  private createFilterLookups() {
    const filterLookups = this.dataStore.filterLookups;
    const lookupCategories: string[] = [];
    this.dataStore.layerLookup.forEach(layerConfig =>
      layerConfig.filters.forEach(filterConfig => {
        if ((lookupCategories.indexOf(filterConfig.lookupCategory) === -1) && filterConfig.lookupCategory) {
          lookupCategories.push(filterConfig.lookupCategory);
        }
      }
      ));
    this.apiService.getLookups(lookupCategories).subscribe((lookups: ILookup[][]) => {
      lookups.forEach((lookup, index) => filterLookups[lookupCategories[index]] = lookup);
      this._filterLookups.next(filterLookups);
      this.applyPermalink();
    });
  }

  applyActiveFilters(activeFilters: IActiveFilter[]) {
    const layerIds = Array.from(new Set(activeFilters.map(activeFilter => activeFilter.layerId)));
    layerIds.forEach(layerId => {
      const activeFiltersForLayer = activeFilters.filter(activeFilter => activeFilter.layerId === layerId);
      this.createLayerFilter(layerId, activeFiltersForLayer);
    });
  }

  createLayerFilter(layerId: number, activeFilters: IActiveFilter[]) {
    const layerConfig = this.getLayerConfig(layerId);
    if (layerConfig) {
      const filterParameters = this.filterService.createFilterParametersForLayer(layerConfig, activeFilters, this.dataStore.filterLookups);
      this.filterLayer(layerConfig, filterParameters, activeFilters);
    } else {
      console.error('error in createLayerFilter: layer with id ' + layerId + ' not found');
    }
  }

  filterLayer(layerConfig: ILayerConfig, filterParameters: IDictionary<string>, activeFilters: IActiveFilter[]) {
    const source = layerConfig.layer.getSource();
    const params = source.getParams();
    Object.keys(filterParameters).forEach(key => delete params[key]);
    let filterPresent = false;
    Object.keys(filterParameters).forEach(key => {
      if (filterParameters[key].length > 0) {
        params[key] = filterParameters[key];
        filterPresent = true;
      }
    });
    source.updateParams(params);

    this.dataStore.activeFilters = this.dataStore.activeFilters.filter(f => f.layerId !== layerConfig.layerId);
    if (filterPresent) {
      this.dataStore.activeFilters = [...this.dataStore.activeFilters, ...activeFilters];
    }
    this._activeFilters.next(this.dataStore.activeFilters);
  }

  clearFilterLayer(layerConfig: ILayerConfig) {
    const source = layerConfig.layer.getSource();
    const params = source.getParams();
    delete params['viewParams'];
    delete params['CQL_FILTER'];
    source.updateParams(params);

    this.dataStore.activeFilters = this.dataStore.activeFilters.filter(f => f.layerId !== layerConfig.layerId);
    this._activeFilters.next(this.dataStore.activeFilters);
  }

  mapReady(map: any) {
    this.map = map;
    this.mapSubject.next(this.map);
  }

  zoomIn() {
    this.zoomInSubject.next();
  }

  zoomOut() {
    this.zoomOutSubject.next();
  }

  zoomToMapExtent() {
    const center = this.dataStore.mapConfig.mapInstance.center;
    const zoom = this.dataStore.mapConfig.mapInstance.zoom;
    this.zoomSubject.next({ center: center, zoom: zoom });
  }

  zoomToLayerExtent(layerId: number) {
    const layerConfig = this.getLayerConfig(layerId);
    // check for null and undefined
    if (layerConfig.extent != null) {
      this.zoomToExtent(layerConfig.extent);
    } else {
      this.zoomToCenterZoom(layerConfig.center, layerConfig.zoom);
    }
  }

  zoomToCenterZoom(center: number[], zoom: number) {
    this.zoomSubject.next({ center: center, zoom: zoom });
  }

  panToLonLat(lon: number, lat: number) {
    const zoom = this.map.getView().getZoom();
    const center  = [lon, lat];
    this.zoomSubject.next({ center: center, zoom: zoom });
  }

  zoomToExtent(extent: number[]) {
    this.zoomToExtentSubject.next(extent);
  }

  dragZoomIn() {
    this.dragZoomInSubject.next();
  }

  dragZoomOut() {
    this.dragZoomOutSubject.next();
  }

  showFeatureInfo(urls: string[], coordinate: [number, number], layerIds: number[]) {
    if (this.featureInfoSubscription) {
      this.featureInfoSubscription.unsubscribe();
    }
    this.featureInfoSubscription = this.apiService.getFeatureInfoForUrls(urls).subscribe(data => {
      this.dataStore.featureInfos = data;
      this._featureInfos.next(this.dataStore.featureInfos);
    });
    if (this.dataStore.mapConfig.mapInstance.allowLayerHighlight) {
      this.highlightFeature(coordinate, layerIds);
    }
  }

  private highlightFeature(coordinate: [number, number], layerIds: number[]) {
      if (layerIds && layerIds.length) {
        // selected layer is the top layer
        const highlightedLayer = this.dataStore.visibleLayers.find(l => l.layerId === layerIds[0]);
        const highlightInfo: IHighlightInfo = {
          coordinate,
          highlightedLayer
        };
        this.dataStore.highlightInfo = highlightInfo;
      } else {
        this.dataStore.highlightInfo = null;
      }
      this.featureHighlightService.highlightFeature(this.dataStore.highlightInfo);
  }

  clearFeatureInfo() {
    this.dataStore.featureInfos = [];
    this._featureInfos.next(this.dataStore.featureInfos);
    this.dataStore.highlightInfo = null;
    if (this.dataStore.mapConfig.mapInstance.allowLayerHighlight) {
       this.featureHighlightService.highlightFeature(this.dataStore.highlightInfo);
    }
  }

  changeLayerVisibility(layerId: number, visible: boolean) {
    this.clearFeatureInfo();
    const layerConfig = this.getLayerConfig(layerId);
    if (layerConfig) {
      layerConfig.layer.setVisible(visible);
      layerConfig.visible = visible;

      if (visible) {
        if (!this.dataStore.visibleLayers.some(visibleLayerConfig => visibleLayerConfig.layerId === layerId)) {
          this.dataStore.visibleLayers = [layerConfig, ...this.dataStore.visibleLayers];
        }
      } else {
        this.dataStore.visibleLayers = this.dataStore.visibleLayers.filter(visibleLayerConfig => visibleLayerConfig !== layerConfig);
        // client requested to keep filter active when layer removed
        // this.dataStore.activeFilters = this.dataStore.activeFilters.filter(f => f.layerId !== layerId);
        // this._activeFilters.next(this.dataStore.activeFilters);
      }
      this._visibleLayers.next(this.dataStore.visibleLayers);
      this._mapConfig.next(this.dataStore.mapConfig);
    } else {
      console.error('error in changeLayerVisibility: layer with id ' + layerId + ' not found');
    }
  }

  removeAllVisibleLayers() {
    const layersToRemove = [...this.dataStore.visibleLayers];
    layersToRemove.forEach(layer => this.changeLayerVisibility(layer.layerId, false));
  }

  changeLayerOpacity(layerId: number, opacity: number) {
    const layerConfig = this.getLayerConfig(layerId);
    layerConfig.layer.setOpacity(opacity);
    layerConfig.opacity = opacity;
  }

  reorderVisibleLayers(previousIndex: number, currentIndex: number) {
    this.clearFeatureInfo();
    moveItemInArray(this.dataStore.visibleLayers, previousIndex, currentIndex);
    this._visibleLayers.next(this.dataStore.visibleLayers);
  }

  ngOnDestroy() {
    if (this.featureInfoSubscription) {
      this.featureInfoSubscription.unsubscribe();
    }
  }

  showLegend(layerId: number) {
    const layerConfig = this.getLayerConfig(layerId);
    if (layerConfig) {
      this.clearFeatureInfo();
      const legendLayerName = layerConfig.legendLayerName ? layerConfig.legendLayerName : layerConfig.layerName;
      const url = layerConfig.url +
        '?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20' +
        '&LEGEND_OPTIONS=fontAntiAliasing:true;fontColor:0x5A5A5A' +
        '&LAYER=' + legendLayerName;

      this.showLegendSubject.next({ name: layerConfig.name, legendUrl: url });
    } else {
      console.error('showLegend: No layer found for layerId: ' + layerId);
    }
  }

  hideLegend() {
    this.showLegendSubject.next(null);
  }

  private getLayerConfig(layerId: number): ILayerConfig {
    return this.dataStore.layerLookup.find((layerConfig) => layerConfig.layerId === layerId);
  }

  /**
   * Only set the baseLayer if the baseLayerId exists
   *
   * @param baseLayerId the id provided for the visible baselayer
   */
  setBaseLayer(baseLayerId: number) {
    if (this.dataStore.baseLayers.find(baseLayer => baseLayer.baseLayerId === baseLayerId)) {
      this.dataStore.baseLayers.forEach(baseLayer => {
        if (baseLayer.baseLayerId === baseLayerId) {
          baseLayer.layer.setVisible(true);
        } else {
          baseLayer.layer.setVisible(false);
        }
      });
    }
  }

  addExternalLayerGroupConfig(layerGroupConfig: ILayerGroupConfig) {
    const format = 'image/png';
    this.createSubLayerGroups(layerGroupConfig);
    this.createLayersForLayerGroupConfig(layerGroupConfig, format);
    const maxOrder = Math.max(...this.dataStore.mapConfig.mapInstance.layerGroups.map(layerGroup => layerGroup.order), 0);
    layerGroupConfig.order = maxOrder + 1;
    this.dataStore.mapConfig.mapInstance.layerGroups.push(layerGroupConfig);
    this._mapConfig.next(this.dataStore.mapConfig);
  }

  createPermalink(): string {
    const zoom = this.map.getView().getZoom();
    const center = this.map.getView().getCenter();
    const layerIds = this.dataStore.visibleLayers.slice().reverse().map(layer => layer.layerId);
    const baseLayerId = this.dataStore.baseLayers.find(baseLayer => baseLayer.layer.getVisible()).baseLayerId;
    const activeFilters = this.dataStore.activeFilters;
    const permalink = this.permalinkService.createPermalink(zoom, center, layerIds, baseLayerId, activeFilters);
    return permalink;
  }

  applyPermalink() {
    const permalink: IPermalink = this.permalinkService.readPermalink();
    if (permalink) {
      this.zoomSubject.next({ center: permalink.center, zoom: permalink.zoom });
      this.setBaseLayer(permalink.baseLayerId);
      this.removeAllVisibleLayers();
      permalink.layerIds.forEach(id => this.changeLayerVisibility(id, true));
      if (permalink.activeFilters.length > 0) {
        this.applyActiveFilters(permalink.activeFilters);
      }
    } else {
      this.zoomToMapExtent();
    }
  }

  startDownloadByBox(layerId: number) {
    this.bboxSubject.next(layerId);
  }

  onDownloadBboxComplete(feature: Feature, layerId: number) {
    const layerConfig = this.getLayerConfig(layerId);
    this.wfsDownloadService.download(feature, layerConfig);
  }
}
