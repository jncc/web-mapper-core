import { ILayerGroupConfig } from './layer-group-config';
import { IExternalWmsConfig } from './external-wms-config.model';
export interface IMapInstance {
        name: string;
        description: string;
        layerGroups: ILayerGroupConfig[];
        center: number[];
        zoom: number;
        externalWmsUrls: IExternalWmsConfig[];
}
