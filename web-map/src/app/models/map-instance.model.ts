import { ILayerConfig } from './layer-config.model';
export interface IMapInstance {
        name: string;
        description: string;
        layers: ILayerConfig[];
}
