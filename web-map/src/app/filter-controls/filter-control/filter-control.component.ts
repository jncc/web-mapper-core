import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ILookup } from 'src/app/models/lookup.model';
import { IActiveFilter } from 'src/app/models/active-filter.model';
import { IFilterConfig } from 'src/app/models/filter-config.model';

@Component({
  selector: 'app-filter-control',
  templateUrl: './filter-control.component.html',
  styleUrls: ['./filter-control.component.scss']
})
export class FilterControlComponent implements OnInit, OnChanges {
  @Input() filterConfig: IFilterConfig;
  @Input() filterLookup: ILookup[];
  @Input() activeFilters: IActiveFilter[];


 get filterLookupIds(): number[] {
   return this.filterState.filter(state => state.checked).map(state => state.lookup.lookupId);
 }

 get filterSummary(): string {
   return this.filterState.filter(state => state.checked).map(state => state.lookup.code).join(' ');
 }

  filterText = '';

  filterState: {lookup: ILookup, checked: boolean}[] = [];

  ngOnInit() {
    this.bindActiveFilter();
  }

  ngOnChanges(changes: SimpleChanges) {
   this.bindActiveFilter();
  }

  private bindActiveFilter() {
    const activeFilter = this.activeFilters.find(f => f.filterId === this.filterConfig.filterId);
     this.filterState = [];
    if (activeFilter) {
      this.filterText = activeFilter.filterText;
      if (this.filterLookup) {
        this.filterLookup.forEach(lookup => {
          const checked = activeFilter.filterLookupIds.indexOf(lookup.lookupId) > -1;
          this.filterState.push({lookup, checked});
        });
      }
    } else {
      this.filterText = '';
      if (this.filterLookup) {
        this.filterLookup.forEach(lookup => {
          this.filterState.push({lookup: lookup, checked: false});
        });
      }
    }
  }

  onCheckChanged(code: string, event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    const state = this.filterState.find(s => s.lookup.code === code);
    state.checked = checkbox.checked;
  }
}
