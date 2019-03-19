import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IPermalink } from './models/permalink.model';
import proj from 'ol/proj';

@Injectable({
  providedIn: 'root'
})
export class PermalinkService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  createPermalink(zoom: number, center: number[], layerIds: number[], baseLayerId: number) {
    const centerLonLat = proj.toLonLat([center[0], center[1]]);
    const queryParams: Params = {
      zoom: zoom,
      center: centerLonLat.map(coord => coord.toFixed(3)).join(),
      layerIds: layerIds.join(),
      baseLayerId: baseLayerId
    };
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams
      });
  }

  readPermalink(): IPermalink {
    const queryDict = {};
    window.location.search.substr(1).split('&').
      forEach(item => queryDict[item.split('=')[0]] = item.split('=')[1]);

    if (this.hasRequiredProperties(queryDict) &&
      this.validateZoom(queryDict['zoom']) &&
      this.validateCenter(queryDict['center']) &&
      this.validateLayerIds(queryDict['layerIds']) &&
      this.validateBaseLayerId(queryDict['baseLayerId'])) {

      const zoom: number = +queryDict['zoom'];
      const center: number[] = queryDict['center'].split(',').map(coord => +coord);
      const layerIds: number[] = queryDict['layerIds'].split(',').filter(layerId => layerId !== '').map(layerId => +layerId);
      const baseLayerId: number = +queryDict['baseLayerId'];

      const permaLink: IPermalink = {
        center: center,
        zoom: zoom,
        layerIds: layerIds,
        baseLayerId: baseLayerId
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
    valid = this.isNumber(value) && +value > 0;
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
