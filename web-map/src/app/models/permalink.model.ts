import { IActiveFilter } from './active-filter.model';

export interface IPermalink {
    center: number[];
    zoom: number;
    layerIds: number[];
    baseLayerId: number;
    activeFilters: IActiveFilter[];
}
