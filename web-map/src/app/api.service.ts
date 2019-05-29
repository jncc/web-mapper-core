import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { IMapInstance } from './models/map-instance.model';
import { Observable, forkJoin } from 'rxjs';
import { ILookup } from './models/lookup.model';
import { IGazetteerResult } from './models/gazetteer-result.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string;
  mapInstanceConfigUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = AppConfigService.settings.apiUrl;
  }

  getConfig(): Observable<IMapInstance[]> {
    const configUrl = this.apiUrl + '/mapinstance';
    return this.http.get<IMapInstance[]>(configUrl);
  }

  getMapInstanceConfig(): Observable<IMapInstance> {
    const mapInstanceConfigUrl = this.apiUrl + '/mapinstance/' + AppConfigService.settings.mapInstance;
    return this.http.get<IMapInstance>(mapInstanceConfigUrl);
  }

  getFeatureInfoForUrls(urls: string[]): Observable<any[]> {
    const responses = [];
    urls.forEach(
      url => responses.push(
        this.http.get(url, { responseType: 'text' }).pipe(
          map(response => this.processGetFeatureInfo(response)))
      )
    );
    return forkJoin(responses);
  }

  processGetFeatureInfo(htmlContent: string): string {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(htmlContent, 'text/html');
    return parsedHtml.body.innerHTML;
  }

  getCapabilities(url: string): Observable<any> {
    return this.http.get(url, { responseType: 'text' });
  }

  getLookup(category: string): Observable<ILookup[]> {
    const lookupUrl = this.apiUrl + '/lookup/' + category;
    return this.http.get<ILookup[]>(lookupUrl);
  }

  getLookups(categories: string[]): Observable<{}[]> {
    const responses = [];
    categories.forEach(
      category => responses.push(this.getLookup(category))
    );
    return forkJoin(responses);
  }

  getGazetteerResults(searchTerm: string) {
    const gazetteerUrl = this.apiUrl + '/gazetteer/' + searchTerm;
    return this.http.get<IGazetteerResult[]>(gazetteerUrl);
  }

}
