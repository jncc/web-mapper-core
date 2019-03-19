import { IFilterConfig } from './filter-config.model';

export interface ILayerConfig {
    layerId: number;
    layerName: string;
    name: string;
    url: string;
    visible: boolean;
    opacity: number;
    layer: any;
    subLayerGroup: string;
    center: number[];
    zoom: number;
    metadataUrl: string;
    metadataDescription: string;
    downloadURL: string;
    legendLayerName: string;
    filters: IFilterConfig[];
}
