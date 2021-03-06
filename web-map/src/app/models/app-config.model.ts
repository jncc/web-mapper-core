export interface IAppConfig {
    name: string;
    logging: boolean;
    apiUrl: string;
    mapInstanceConfigUrl: string;
    mapInstance: string;
    bingMapsApiKey: string;
    defaultBaseLayer: string;
    gazetteerPlaceholder: string;
}
