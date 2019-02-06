import { ILayerConfig } from './layer-config.model';

export interface ILayerGroupConfig {
        layerGroupId: number;
        name: string;
        layers: ILayerConfig[];
}
