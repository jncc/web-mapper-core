import { IFilterConfig } from './filter-config.model';

export interface ILayerConfig {
    layerId: number;
    layerName: string;
    name: string;
    url: string;
    order: number;
    defaultOrder: number;
    visible: boolean;
    opacity: number;
    layer: any;
    subLayerGroup: string;
    center: number[];
    zoom: number;
    extent?: number[];
    metadataUrl: string;
    metadataDescription: string;
    downloadURL: string;
    legendLayerName: string;
    filters: IFilterConfig[];
}
