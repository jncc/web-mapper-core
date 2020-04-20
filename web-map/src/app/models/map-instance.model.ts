import { ILayerGroupConfig } from './layer-group-config';
import { IExternalWmsConfig } from './external-wms-config.model';
export interface IMapInstance {
        name: string;
        description: string;
        attribution: string;
        maxZoom: number;
        allowLayerHighlight: boolean;
        layerGroups: ILayerGroupConfig[];
        baseLayers: [];
        center: number[];
        zoom: number;
        externalWmsUrls: IExternalWmsConfig[];
}
