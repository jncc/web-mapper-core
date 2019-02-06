import { ILayerGroupConfig } from './layer-group-config';
export interface IMapInstance {
        name: string;
        description: string;
        layerGroups: ILayerGroupConfig[];
}
