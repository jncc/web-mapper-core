import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { IGazetteerResult } from '../models/gazetteer-result.model';
import { Observable, Subject, of, concat } from 'rxjs';
import { MapService } from '../map.service';
import { debounceTime, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../app-config.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-gazetteer',
  templateUrl: './gazetteer.component.html',
  styleUrls: ['./gazetteer.component.scss']
})
export class GazetteerComponent implements OnInit {
  @ViewChild('gazetteer', { static: true }) gazetteer: NgSelectComponent;

  placeholder = 'Search for marine regions ...';

  results$: Observable<IGazetteerResult[]>;
  searchInput$ = new Subject<string>();
  resultsLoading = false;

  selectedResult: IGazetteerResult;

  constructor(private apiService: ApiService, private mapService: MapService) {
    if (AppConfigService.settings.gazetteerPlaceholder) {
      this.placeholder = AppConfigService.settings.gazetteerPlaceholder;
    }
   }

  ngOnInit() {
    this.loadResults();
  }

  onChange() {
    if (this.selectedResult) {
      this.mapService.zoomToExtent(this.selectedResult.extent);
      this.gazetteer.blur();
    }
  }

  onFocus() {
    this.selectedResult = null;
  }

  // https://github.com/ng-select/ng-select/blob/master/demo/app/examples/search.component.ts
  loadResults() {
    this.results$ = concat(
      of([]),
      this.searchInput$.pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => this.resultsLoading = true),
        switchMap( term => this.apiService.getGazetteerResults(term).pipe(
          catchError(() => of([])),
          tap(() => this.resultsLoading = false)
        ))
      )
    );
  }

}
