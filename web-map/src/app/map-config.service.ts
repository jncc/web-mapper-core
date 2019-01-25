import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { IMapConfig } from './models/map-config.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapConfigService {

  configUrl: string;
  config: Observable<IMapConfig>;

  private _mapConfig: BehaviorSubject<IMapConfig>;
  get mapConfig() {
    return this._mapConfig.asObservable();
  }

  constructor(private http: HttpClient) {
    this.configUrl = AppConfigService.settings.apiUrl;
    this.config = this.getConfig();
    this._mapConfig = <BehaviorSubject<IMapConfig>>new BehaviorSubject({});
  }

  private getConfig() {
    return this.http.get<IMapConfig>(this.configUrl);
  }

  loadConfig() {
    this.http.get<IMapConfig>(this.configUrl).subscribe(data => {
        this._mapConfig.next(data);
      }
    );
  }
}
