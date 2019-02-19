import { ILayerGroupConfig } from './layer-group-config';
export interface IMapInstance {
        name: string;
        description: string;
        layerGroups: ILayerGroupConfig[];
        center: number[];
        zoom: number;
}
