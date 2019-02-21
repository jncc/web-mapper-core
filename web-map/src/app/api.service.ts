import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { IMapInstance } from './models/map-instance.model';
import { Observable, forkJoin } from 'rxjs';

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
    const mapInstanceConfigUrl = this.apiUrl + '/mapinstance/EMODnet';
    return this.http.get<IMapInstance>(mapInstanceConfigUrl);
  }

  getFeatureInfoForUrls(urls: string[]): Observable<any[]> {
    const responses = [];
    urls.forEach(
      url => responses.push(this.http.get(url, {responseType: 'text'}))
    );
    return forkJoin(responses);
  }

  getCapabilities(url: string): Observable<any> {
    return this.http.get(url, {responseType: 'text'});
  }

}
