import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IGazetteerResult } from '../models/gazetteer-result.model';
import { Observable } from 'rxjs';
import { MapService } from '../map.service';

@Component({
  selector: 'app-gazetteer',
  templateUrl: './gazetteer.component.html',
  styleUrls: ['./gazetteer.component.scss']
})
export class GazetteerComponent implements OnInit {

  results$: Observable<IGazetteerResult[]>;

  selectedResult: IGazetteerResult;

  constructor(private apiService: ApiService, private mapService: MapService) { }

  ngOnInit() {

  }

  onChange() {
    console.log(this.selectedResult);
    if (this.selectedResult) {
      this.mapService.zoomToExtent(this.selectedResult.extent);
    }
  }

  onSearch(data) {
    console.log(data);
    this.results$ = this.apiService.getGazetteerResults(data.term);
  }

}
