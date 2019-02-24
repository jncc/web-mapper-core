import { ILookup } from './lookup.model';

export interface IFilterConfig {
    filterId: number;
    name: string;
    description: string;
    attribute: string;
    lookupCategory: string;
    lookupValues: ILookup[];
}
