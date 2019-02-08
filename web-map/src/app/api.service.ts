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
  }

  getConfig() {
    const configUrl = this.apiUrl + '/mapinstance';
    return this.http.get<IMapInstance[]>(configUrl);
  }

  getMapInstanceConfig() {
    const mapInstanceConfigUrl = this.apiUrl + '/mapinstance/EMODnet';

    return this.http.get<IMapInstance>(mapInstanceConfigUrl);
  }

}
