import { Injectable } from '@angular/core';
import { IActiveFilter } from './models/active-filter.model';
import { ILayerConfig } from './models/layer-config.model';
import { ILookup } from './models/lookup.model';
import { IFilterConfig } from './models/filter-config.model';

import { IDictionary } from './models/dictionary.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  createFilterParametersForLayer(layerConfig: ILayerConfig, activeFilters: IActiveFilter[],
    filterLookups: { [lookupCategory: string]: ILookup[] }): IDictionary<string> {

    const filterParameters: IDictionary<string> = {};
    filterParameters['viewParams'] = '';
    filterParameters['CQL_FILTER'] = '';

    if (activeFilters.length > 0) {
      if (layerConfig) {
        activeFilters.forEach(activeFilter => {
          const filterConfig = layerConfig.filters.find(f => f.filterId === activeFilter.filterId);
          if (filterConfig) {
            if (filterConfig.isComplex) {
              filterParameters['viewParams'] += this.populateSqlViewFilter(filterConfig, activeFilter, filterLookups);
            } else {
              if (filterParameters['CQL_FILTER'].length > 0) {
                filterParameters['CQL_FILTER'] += ' AND ' + this.populateCqlFilter(filterConfig, activeFilter, filterLookups);
              } else {
                filterParameters['CQL_FILTER'] = this.populateCqlFilter(filterConfig, activeFilter, filterLookups);
              }
            }
          }
        });
      }
    }
    return filterParameters;
  }

  private populateSqlViewFilter(filterConfig: IFilterConfig, activeFilter: IActiveFilter,
    filterLookups: { [lookupCategory: string]: ILookup[] }): string {

    let filterString = '';
    if (filterConfig.type === 'lookup' && activeFilter.filterLookupIds.length > 0) {
      filterString += filterConfig.attribute + ':';
      const filterLookup = filterLookups[filterConfig.lookupCategory];
      activeFilter.filterLookupIds.forEach((lookupId, index) => {
        const filterCode = filterLookup.find(lookup => lookup.lookupId === lookupId).code;
        const code = '\'' + this.escapeSpecialCharacters(filterCode) + '\'';
        filterString += code;
        if (index < activeFilter.filterLookupIds.length - 1) {
          filterString += '\\,';
        }
      });
      filterString += ';';
    } else if (filterConfig.type === 'text' && activeFilter.filterText.length > 0) {
      filterString += filterConfig.attribute + ':';
      filterString += this.escapeSpecialCharacters(activeFilter.filterText);
      filterString += ';';
    }
    return filterString;
  }

  private populateCqlFilter(filterConfig: IFilterConfig, activeFilter: IActiveFilter,
    filterLookups: { [lookupCategory: string]: ILookup[] }): string {

      let filterString = '';
      if (filterConfig.type === 'lookup' && activeFilter.filterLookupIds.length > 0) {
          filterString += filterConfig.attribute + ' IN (';
          const filterLookup = filterLookups[filterConfig.lookupCategory];
          activeFilter.filterLookupIds.forEach((lookupId, index) => {
            const filterCode = filterLookup.find(lookup => lookup.lookupId === lookupId).code;
            filterString += `'${filterCode}'`;
            if (index < activeFilter.filterLookupIds.length - 1) {
              filterString += ',';
            }
          });
          filterString += ')';
        }
      return filterString;
    }

  // In Geoserver SQL Views, semicolons or commas must be escaped with a backslash (e.g. \, and \;)
  private escapeSpecialCharacters(value: string): string {
    return value.replace(/,/g, '\\,').replace(/;/g, '\\;');
  }
}
