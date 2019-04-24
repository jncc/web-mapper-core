import { Injectable } from '@angular/core';

import proj from 'ol/proj';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { IPermalink } from './models/permalink.model';
import { IActiveFilter } from './models/active-filter.model';

@Injectable({
  providedIn: 'root'
})
export class PermalinkService {

  hostUrl: string;

  constructor() { }

  createPermalink(zoom: number, center: number[], layerIds: number[], baseLayerId: number, activeFilters: IActiveFilter[]): string {
    const centerLonLat = proj.toLonLat([center[0], center[1]]);
    let compressedActiveFilters = '';
    if (activeFilters && activeFilters.length > 0) {
      compressedActiveFilters = compressToEncodedURIComponent(JSON.stringify(activeFilters));
    }

    // tslint:disable-next-line:max-line-length
    const queryString = `zoom=${zoom}&center=${centerLonLat.map(coord => coord.toFixed(3)).join()}&layerIds=${layerIds.join()}&baseLayerId=${baseLayerId}&activeFilters=${compressedActiveFilters}`;

    let permalink = '';
    if (this.hostUrl) {
      if (this.hostUrl.indexOf('?') !== -1) {
        permalink = `${this.hostUrl}&${queryString}`;
      } else {
        permalink = `${this.hostUrl}?${queryString}`;
      }
    } else {
      permalink = `${location.origin}/?${queryString}`;
    }
    return permalink;
  }

  readPermalink(): IPermalink {
    const queryDict = {};
    window.location.search.substr(1).split('&').
      forEach(item => queryDict[item.split('=')[0]] = item.split('=')[1]);

    if (queryDict['ifp']) {
      this.hostUrl = atob(decodeURIComponent(queryDict['ifp']));
    }

    if (this.hasRequiredProperties(queryDict) &&
      this.validateZoom(queryDict['zoom']) &&
      this.validateCenter(queryDict['center']) &&
      this.validateLayerIds(queryDict['layerIds']) &&
      this.validateBaseLayerId(queryDict['baseLayerId'])) {

      const zoom: number = +queryDict['zoom'];
      const center: number[] = queryDict['center'].split(',').map(coord => +coord);
      const layerIds: number[] = queryDict['layerIds'].split(',').filter(layerId => layerId !== '').map(layerId => +layerId);
      const baseLayerId: number = +queryDict['baseLayerId'];

      let activeFilters: IActiveFilter[] = [];
      if (queryDict['activeFilters']) {
        const decodedActiveFiltersJSON = decompressFromEncodedURIComponent(decodeURIComponent(queryDict['activeFilters']));
        if (decodedActiveFiltersJSON) {
          try {
            activeFilters = JSON.parse(decodedActiveFiltersJSON);
          } catch (error) {
            console.error('invalid active filters - no filter applied');
            activeFilters = [];
          }
        } else {
          console.error('invalid active filters - no filter applied');
        }
      }
      const permaLink: IPermalink = {
        center: center,
        zoom: zoom,
        layerIds: layerIds,
        baseLayerId: baseLayerId,
        activeFilters: activeFilters
      };
      return permaLink;
    } else {
      return null;
    }
  }

  hasRequiredProperties(queryDict: any): boolean {
    return queryDict.hasOwnProperty('zoom') && queryDict.hasOwnProperty('center') &&
      queryDict.hasOwnProperty('layerIds') && queryDict.hasOwnProperty('baseLayerId');
  }

  validateZoom(value: string): boolean {
    if (this.isNumberInRange(value, 1, 20)) {
      return true;
    } else {
      return false;
    }
  }

  validateCenter(value: string): boolean {
    let valid = true;
    const valueArray = value.split(',');
    if (!(valueArray.length === 2)) {
      valid = false;
    }
    if (!this.isNumberInRange(valueArray[0], -180, 180)) {
      valid = false;
    }
    if (!this.isNumberInRange(valueArray[1], -90, 90)) {
      valid = false;
    }
    return valid;
  }

  validateLayerIds(value: string): boolean {
    let valid = true;
    const valueArray = value.split(',').filter(v => v !== '');
    valueArray.forEach(v => {
      valid = this.isNumber(v) && +v > 0;
    });
    return valid;
  }

  validateBaseLayerId(value: string): boolean {
    let valid = true;
    valid = this.isNumber(value);
    return valid;
  }

  isNumber(value: string | number): boolean {
    return ((value != null) && !isNaN(Number(value.toString())));
  }

  isNumberInRange(value: string | number, min: number, max: number) {
    if (this.isNumber(value)) {
      const numericValue = +value;
      if (numericValue >= min && numericValue <= max) {
        return true;
      }
    }
    return false;
  }
}
