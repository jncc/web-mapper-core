import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { IMapConfig } from './models/map-config.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapConfigService {

  configUrl: string;
  config: Observable<IMapConfig>;

  constructor(private http: HttpClient) {
    this.configUrl = AppConfigService.settings.apiUrl;
    this.config = this.getConfig();
  }

  private getConfig() {
    return this.http.get<IMapConfig>(this.configUrl);
  }
}
