import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-gazetteer',
  templateUrl: './gazetteer.component.html',
  styleUrls: ['./gazetteer.component.scss']
})
export class GazetteerComponent implements OnInit {


  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getGazetteerResults('po').subscribe((results) => {
      console.log(results);
    });
  }

}
