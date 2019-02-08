import { ILayerConfig } from './layer-config.model';

export interface ISubLayerGroupConfig {
        sublayerGroupId: number;
        name: string;
        layers: ILayerConfig[];
}
