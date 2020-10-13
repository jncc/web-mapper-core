import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';
import { MeasureType } from '../measure-type.enum';
import { MeasureService } from '../measure.service';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class MeasureComponent implements OnInit, OnDestroy {

  measureType = MeasureType.LineString;

  constructor(private measureService: MeasureService) { }

  ngOnInit(): void {
    this.measureService.measureStart();
  }

  ngOnDestroy(): void {
    this.measureService.measureEnd();
  }

  onMeasureTypeChange(event: MeasureType) {
    this.measureService.changeMeasureType(event);
  }

}
