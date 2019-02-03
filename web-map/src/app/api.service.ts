import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { IMapConfig } from './models/map-config.model';
import { IMapInstance } from './models/map-instance.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string;
  mapInstanceConfigUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = AppConfigService.settings.apiUrl;
    this.mapInstanceConfigUrl = AppConfigService.settings.mapInstanceConfigUrl;
  }

  getConfig() {
    const configUrl = this.apiUrl; // TODO: + '/test';
    return this.http.get<IMapConfig>(configUrl);
  }

  getMapInstanceConfig() {
    // TODO:
    // const mapInstanceConfigUrl = this.apiUrl; // TODO:  + '/mapbyname/EMODnet';

    return this.http.get<IMapInstance>(this.mapInstanceConfigUrl);
  }

}
