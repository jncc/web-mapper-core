import { ILayerConfig } from './layer-config.model';

export interface IHighlightInfo {
    coordinate: [number, number];
    highlightedLayer: ILayerConfig;
}
