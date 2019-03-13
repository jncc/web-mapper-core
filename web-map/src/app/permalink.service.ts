import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { IPermalink } from './models/permalink.model';
import proj from 'ol/proj';

@Injectable({
  providedIn: 'root'
})
export class PermalinkService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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

   // TODO: more validation
   readPermalink(): IPermalink {
     const queryDict = {};
      window.location.search.substr(1).split('&').
        forEach(item => queryDict[item.split('=')[0]] = item.split('=')[1]);
      const validPermalink: boolean = queryDict.hasOwnProperty('zoom') && queryDict.hasOwnProperty('center') &&
        queryDict.hasOwnProperty('layerIds') && queryDict.hasOwnProperty('baseLayerId');

      if (validPermalink) {
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
}
