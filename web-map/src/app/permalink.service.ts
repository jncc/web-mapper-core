import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PermalinkService {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {

   }

   updateUrl(zoom: number, center: number[], layerIds: number[], baseLayerId: number) {
     const queryParams: Params = {
       zoom: zoom,
       center: center.map(coord => Math.round(coord)).join(),
       layerIds: layerIds.join(),
       baseLayerId: baseLayerId
     };
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: queryParams
      });

      console.log(this.activatedRoute.snapshot.queryParams);
   }
}
