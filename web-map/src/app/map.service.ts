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
import { IBaseLayerConfig } from './models/base-layer-config.model';
import { IActiveFilter } from './models/active-filter.model';
import { IPermalink } from './models/permalink.model';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class MapService implements OnDestroy {

  map: any;

  dragZoomInSubject = new Subject<void>();
  dragZoomOutSubject = new Subject<void>();
  zoomSubject = new Subject<{ center: number[], zoom: number }>();
  zoomToExtentSubject = new Subject<number[]>();

  showLegendSubject = new Subject<{ name: string, legendUrl: string }>();

  private dataStore: {
    mapConfig: IMapConfig;
    layerLookup: ILayerConfig[];
    visibleLayers: ILayerConfig[];
    baseLayers: IBaseLayerConfig[];
    featureInfos: any[];
    filterLookups: { [lookupCategory: string]: ILookup[]; };
    activeFilters: IActiveFilter[];
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

  private _baseLayers: BehaviorSubject<IBaseLayerConfig[]>;
  get baseLayers() {
    return this._baseLayers.asObservable();
  }

  private _activeFilters: BehaviorSubject<IActiveFilter[]>;
  get activeFilters() {
    return this._activeFilters.asObservable();
  }

  constructor(
    private apiService: ApiService,
    private layerService: LayerService,
    private permalinkService: PermalinkService,
    private filterService: FilterService
  ) {
    this.dataStore = {
      mapConfig: {
        mapInstances: [],
        mapInstance: {
          attribution: '',
          name: '',
          description: '',
          layerGroups: [],
          center: [],
          zoom: 0,
          externalWmsUrls: [],
          maxZoom: 20
        }
      },
      layerLookup: [],
      visibleLayers: [],
      baseLayers: [],
      featureInfos: [],
      filterLookups: {},
      activeFilters: []
    };
    this._mapConfig = <BehaviorSubject<IMapConfig>>new BehaviorSubject(this.dataStore.mapConfig);
    this._visibleLayers = <BehaviorSubject<ILayerConfig[]>>new BehaviorSubject(this.dataStore.visibleLayers);
    this._featureInfos = <BehaviorSubject<any[]>>new BehaviorSubject(this.dataStore.featureInfos);
    this._filterLookups = new BehaviorSubject({});
    this._baseLayers = new BehaviorSubject(this.dataStore.baseLayers);
    this._activeFilters = new BehaviorSubject(this.dataStore.activeFilters);
    this.subscribeToConfig();

    this.subscribeToMapInstanceConfig();
  }

  private subscribeToConfig() {
    this.apiService.getConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstances = data;
      this._mapConfig.next(this.dataStore.mapConfig);
    }, error => console.log('Could not load map config.'));
  }

  private subscribeToMapInstanceConfig() {
    this.apiService.getMapInstanceConfig().subscribe((data) => {
      this.dataStore.mapConfig.mapInstance = data;
      // console.log(this.dataStore.mapConfig.mapInstance);
      this.createMapInstanceConfig();
      this.createLayersForConfig();
      this.createBaseLayers();
      this._mapConfig.next(this.dataStore.mapConfig);
      this.createFilterLookups();
    }, error => console.log('Could not load map instance config.'));
  }

  // transform map instance config received from api into hierarchy of layergroups, sublayergroups, layers
  private createMapInstanceConfig() {
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach((layerGroupConfig: ILayerGroupConfig) => {
      this.createSubLayerGroups(layerGroupConfig);
    });
  }

  private createSubLayerGroups(layerGroupConfig: ILayerGroupConfig) {
    const subLayerGroups: ISubLayerGroupConfig[] = layerGroupConfig.layers.
      map((layer) => layer.subLayerGroup).
      reduce((a: ISubLayerGroupConfig[], subLayerGroup, index) => {
        if (!a.find((slg) => subLayerGroup === slg.name)) {
          a.push({ name: subLayerGroup, layers: [], sublayerGroupId: index });
        }
        return a;
      }, []);
    layerGroupConfig.layers.forEach((layerConfig) => {
      const subLayerGroup = subLayerGroups.find((slg) => slg.name === layerConfig.subLayerGroup);
      subLayerGroup.layers.push(layerConfig);
    });
    layerGroupConfig.subLayerGroups = subLayerGroups;
  }

  // TODO: move to another service
  private createLayersForConfig(): void {
    this.dataStore.mapConfig.mapInstance.layerGroups.forEach(layerGroupConfig => {
      this.createLayersForLayerGroupConfig(layerGroupConfig);
    });
    this._visibleLayers.next(this.dataStore.visibleLayers);
  }

  private createLayersForLayerGroupConfig(layerGroupConfig: ILayerGroupConfig) {
    if (layerGroupConfig.layers.length) {
      layerGroupConfig.layers.forEach((layerConfig: ILayerConfig) => {
        layerConfig.layer = this.layerService.createLayer(layerConfig);
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
    this.dataStore.baseLayers = this.layerService.createBaseLayers();
    this._baseLayers.next(this.dataStore.baseLayers);
  }

  private createFilterLookups() {
    const filterLookups = this.dataStore.filterLookups;
    const lookupCategories: string[] = [];
    this.dataStore.layerLookup.forEach(layerConfig =>
      layerConfig.filters.forEach(filterConfig => {
        if (!lookupCategories.includes(filterConfig.lookupCategory) && filterConfig.lookupCategory) {
          lookupCategories.push(filterConfig.lookupCategory);
        }
      }
      ));
    this.apiService.getLookups(lookupCategories).subscribe(lookups => {
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
    if (activeFilters.length > 0) {
      const layerConfig = this.getLayerConfig(layerId);
      if (this.isComplexFilter(layerConfig)) {
        this.applySqlViewFilter(activeFilters, layerConfig);
      } else {
        this.applyCqlFilter(activeFilters, layerConfig);
      }
    }
  }

  private isComplexFilter(layerConfig: ILayerConfig): boolean {
    return layerConfig.filters.every(filter => filter.isComplex);
  }

  private applySqlViewFilter(activeFilters: IActiveFilter[], layerConfig: ILayerConfig) {
    const paramName = 'viewParams';
    let filterString = '';
    activeFilters.forEach(activeFilter => {
      const filterConfig = layerConfig.filters.find(f => f.filterId === activeFilter.filterId);
      if (filterConfig) {
        if (filterConfig.type === 'lookup' && activeFilter.filterLookupIds.length > 0) {
          filterString += filterConfig.attribute + ':';
          const filterLookup = this.dataStore.filterLookups[filterConfig.lookupCategory];
          activeFilter.filterLookupIds.forEach((lookupId, index) => {
            const filterCode = filterLookup.find(lookup => lookup.lookupId === lookupId).code;
            const code = '\'' + this.escapeSpecialCharacters(filterCode) + '\'';
            filterString += code;
            if (index < activeFilter.filterLookupIds.length - 1) {
              filterString += '\\,';
            }
          });
          filterString += ';';
        } else if (filterConfig.type === 'text' && activeFilter.filterText.length > 0) {
          filterString += filterConfig.attribute + ':';
          filterString += this.escapeSpecialCharacters(activeFilter.filterText);
          filterString += ';';
        }
      }
    });
    this.filterLayer(layerConfig.layerId, paramName, filterString, activeFilters);
  }

  private applyCqlFilter(activeFilters: IActiveFilter[], layerConfig: ILayerConfig) {
    const paramName = 'CQL_FILTER';
    let filterString = '';
    activeFilters.forEach(activeFilter => {
      const filterConfig = layerConfig.filters.find(f => f.filterId === activeFilter.filterId);
      if (filterConfig) {
        if (filterConfig.type === 'lookup' && activeFilter.filterLookupIds.length > 0) {
          if (filterString.length > 0) {
            // there is already at least one filter in the string so use AND
            filterString += ' AND ';
          }
          filterString += filterConfig.attribute + ' IN (';
          const filterLookup = this.dataStore.filterLookups[filterConfig.lookupCategory];
          activeFilter.filterLookupIds.forEach((lookupId, index) => {
            const filterCode = filterLookup.find(lookup => lookup.lookupId === lookupId).code;
            filterString += `'${filterCode}'`;
            if (index < activeFilter.filterLookupIds.length - 1) {
              filterString += ',';
            }
          });
          filterString += ')';
        }
      }
    });
    this.filterLayer(layerConfig.layerId, paramName, filterString, activeFilters);
  }

  // In Geoserver SQL Views, semicolons or commas must be escaped with a backslash (e.g. \, and \;)
  private escapeSpecialCharacters(value: string): string {
    return value.replace(/,/g, '\\,').replace(/;/g, '\\;');
  }

  filterLayer(layerId: number, paramName: string, filterString: string, activeFilters: IActiveFilter[]) {
    const layerConfig = this.getLayerConfig(layerId);
    const source = layerConfig.layer.getSource();
    const params = layerConfig.layer.getSource().getParams();
    params[paramName] = filterString;
    source.updateParams(params);

    this.dataStore.activeFilters = this.dataStore.activeFilters.filter(f => f.layerId !== layerId);
    this.dataStore.activeFilters = [...this.dataStore.activeFilters, ...activeFilters];
    this._activeFilters.next(this.dataStore.activeFilters);
  }

  clearFilterLayer(layerId: number, paramName: string) {
    const layerConfig = this.getLayerConfig(layerId);
    const source = layerConfig.layer.getSource();
    const params = layerConfig.layer.getSource().getParams();
    delete params[paramName];
    source.updateParams(params);

    this.dataStore.activeFilters = this.dataStore.activeFilters.filter(f => f.layerId !== layerId);
    this._activeFilters.next(this.dataStore.activeFilters);
  }

  mapReady(map: any) {
    this.map = map;
  }

  zoomIn() {
    this.map.getView().setZoom(this.map.getView().getZoom() + 1);
  }

  zoomOut() {
    this.map.getView().setZoom(this.map.getView().getZoom() - 1);
  }

  zoomToMapExtent() {
    const center = this.dataStore.mapConfig.mapInstance.center;
    const zoom = this.dataStore.mapConfig.mapInstance.zoom;
    this.zoomSubject.next({ center: center, zoom: zoom });
  }

  zoomToLayerExtent(layerId: number) {
    const layerConfig = this.getLayerConfig(layerId);
    this.zoomSubject.next({ center: layerConfig.center, zoom: layerConfig.zoom });
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

  showFeatureInfo(urls: string[]) {
    if (this.featureInfoSubscription) {
      this.featureInfoSubscription.unsubscribe();
    }
    this.featureInfoSubscription = this.apiService.getFeatureInfoForUrls(urls).subscribe(data => {
      this.dataStore.featureInfos = data;
      this._featureInfos.next(this.dataStore.featureInfos);
    });
  }

  clearFeatureInfo() {
    this.dataStore.featureInfos = [];
    this._featureInfos.next(this.dataStore.featureInfos);
  }

  changeLayerVisibility(layerId: number, visible: boolean) {
    const layerConfig = this.getLayerConfig(layerId);
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
    const legendLayerName = layerConfig.legendLayerName ? layerConfig.legendLayerName : layerConfig.layerName;
    const url = layerConfig.url +
      '?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&WIDTH=20&HEIGHT=20' +
      '&LEGEND_OPTIONS=fontAntiAliasing:true;fontColor:0x5A5A5A' +
      '&LAYER=' + legendLayerName;

    this.showLegendSubject.next({ name: layerConfig.name, legendUrl: url });
  }

  hideLegend() {
    this.showLegendSubject.next(null);
  }

  private getLayerConfig(layerId: number): ILayerConfig {
    return this.dataStore.layerLookup.find((layerConfig) => layerConfig.layerId === layerId);
  }

  setBaseLayer(baseLayerId: number) {
    this.dataStore.baseLayers.forEach(baseLayer => {
      if (baseLayer.baseLayerId === baseLayerId) {
        baseLayer.layer.setVisible(true);
      } else {
        baseLayer.layer.setVisible(false);
      }
    });
  }

  onMapMoveEnd(zoom: number, center: number[]) {
    // const layerIds = this.dataStore.visibleLayers.map(layer => layer.layerId);
    // const baseLayerId = this.dataStore.baseLayers.find(baseLayer => baseLayer.layer.getVisible()).baseLayerId;
    // this.permalinkService.updateUrl(zoom, center, layerIds, baseLayerId);
  }

  addExternalLayerGroupConfig(layerGroupConfig: ILayerGroupConfig) {
    this.createSubLayerGroups(layerGroupConfig);
    this.createLayersForLayerGroupConfig(layerGroupConfig);
    this.dataStore.mapConfig.mapInstance.layerGroups.push(layerGroupConfig);
    this._mapConfig.next(this.dataStore.mapConfig);
    // console.log(this.dataStore.mapConfig.mapInstance);
  }

  createPermalink() {
    const zoom = this.map.getView().getZoom();
    const center = this.map.getView().getCenter();
    const layerIds = this.dataStore.visibleLayers.slice().reverse().map(layer => layer.layerId);
    const baseLayerId = this.dataStore.baseLayers.find(baseLayer => baseLayer.layer.getVisible()).baseLayerId;
    const activeFilters = this.dataStore.activeFilters;
    this.permalinkService.createPermalink(zoom, center, layerIds, baseLayerId, activeFilters);
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
}
