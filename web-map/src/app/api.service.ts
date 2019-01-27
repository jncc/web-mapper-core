import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { IMapConfig } from './models/map-config.model';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = AppConfigService.settings.apiUrl;
  }

  getConfig() {
    return this.http.get<IMapConfig>(this.apiUrl);
  }

}
