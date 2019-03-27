import { ILayerGroupConfig } from './layer-group-config';
import { IExternalWmsConfig } from './external-wms-config.model';
export interface IMapInstance {
        name: string;
        description: string;
        attribution: string;
        maxZoom: number;
        layerGroups: ILayerGroupConfig[];
        center: number[];
        zoom: number;
        externalWmsUrls: IExternalWmsConfig[];
}
