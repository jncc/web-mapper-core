import { Injectable } from '@angular/core';
import { MapService } from './map.service';
import olMap from 'ol/map'; // rename the default export
import Draw from 'ol/interaction/draw';
import VectorSource from 'ol/source/vector';
import VectorLayer from 'ol/layer/vector';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import Circle from 'ol/style/circle';
import Feature from 'ol/feature';
import Style from 'ol/style/style';
import { MeasureType } from './measure-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MeasureService {

  private map: olMap;
  private drawInteraction: Draw;
  private measureLayer: VectorLayer;
  private measureSource: VectorSource;
  private measureFeature: Feature;
  private measureLayerStyle: Style;
  private measureFeatureStyle: Style;

  constructor(private mapService: MapService) {
    this.mapService.mapSubject.subscribe(map => this.map = map);
    this.setupStyles();
  }

  private setupInteraction(measureType: MeasureType) {
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
    }

    this.drawInteraction = new Draw({
      source: this.measureSource,
      type: measureType,
      style: this.measureFeatureStyle
    });

    this.map.addInteraction(this.drawInteraction);

    this.drawInteraction.on('drawstart', (event: ol.interaction.Draw.Event) => {
      this.measureFeature = event.feature;
    });

    this.drawInteraction.on('drawend', (event: ol.interaction.Draw.Event) => {
      // console.log(event.feature);
    });
  }

  changeMeasureType(measureType: MeasureType) {
    this.setupInteraction(measureType);
  }

  measureStart(): void {
    this.setupLayer();
    this.setupInteraction(MeasureType.LineString);
    // this.map.addLayer(this.measureLayer);
  }

  measureEnd() {
    this.map.removeInteraction(this.drawInteraction);
    this.map.removeLayer(this.measureLayer);
  }

  private setupLayer() {
    this.measureSource = new VectorSource();

    this.measureLayer = new VectorLayer({
      source: this.measureSource,
      style: this.measureLayerStyle
    });

    this.map.addLayer(this.measureLayer);

  }

  private setupStyles() {
    this.measureLayerStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    });

    this.measureFeatureStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new Circle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    });
  }
}
