import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IAppConfig } from './models/app-config.model';

/*
 see: https://blogs.msdn.microsoft.com/premier_developer/2018/03/01/angular-how-to-editable-config-files/
*/
@Injectable()
export class AppConfigService {
    static settings: IAppConfig;
    constructor(private http: HttpClient) {}
    load() {
        // date to number in base36 to prevent caching
        const dateHash = (+new Date).toString(36);
        const configFile = `assets/config/config.${environment.name}.json?v=${dateHash}`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(configFile).toPromise().then((response: IAppConfig) => {
               AppConfigService.settings = <IAppConfig>response;
               // console.log(AppConfigService.settings);
               resolve();
            }).catch((response: any) => {
               reject(`Could not load config file '${configFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}
