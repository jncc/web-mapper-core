import { ILookup } from './lookup.model';

export interface IFilterConfig {
    filterId: number;
    name: string;
    description: string;
    isComplex: boolean;
    type: string;
    attribute: string;
    lookupCategory: string;
    lookupValues: ILookup[];
}
