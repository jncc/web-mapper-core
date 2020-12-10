import { Pipe, PipeTransform } from '@angular/core';
import { IFilterConfig } from './models/filter-config.model';

@Pipe({
  name: 'filterSort'
})
export class FilterSortPipe implements PipeTransform {

  transform(filters: IFilterConfig[]): IFilterConfig[] {
    return filters.sort((a: IFilterConfig, b: IFilterConfig) => a.order - b.order);
  }

}

