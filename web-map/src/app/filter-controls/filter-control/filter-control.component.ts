import { Component, OnInit, Input } from '@angular/core';
import { ILookup } from 'src/app/models/lookup.model';

@Component({
  selector: 'app-filter-control',
  templateUrl: './filter-control.component.html',
  styleUrls: ['./filter-control.component.scss']
})
export class FilterControlComponent implements OnInit {
  @Input() filterName: string;
  @Input() filterAttribute: string;
  @Input() filterLookup: { [lookupCategory: string]: ILookup[] };


  filterCodes: string[] = [];

  ngOnInit() {
  }

  onCheckChanged(code: string, event: Event) {
    const checkbox = <HTMLInputElement>event.target;
    if (checkbox.checked) {
      this.filterCodes.push(code);
    } else {
      this.filterCodes = this.filterCodes.filter(value => value !== code);
    }
    console.log(this.filterCodes);
  }
}
