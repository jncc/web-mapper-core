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
import { Subject } from 'rxjs';
import MapBrowserEvent from 'ol/mapbrowserevent';
import Polygon from 'ol/geom/polygon';
import Overlay from 'ol/overlay';
import olObservable from 'ol/observable';
import Sphere from 'ol/sphere';
import Geometry from 'ol/geom/geometry';


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
  private measureTooltipElement: HTMLElement;
  private measureTooltip: Overlay;
  private helpTooltipElement: HTMLElement;
  private helpTooltip: Overlay;

  private measuringSubject = new Subject<boolean>();
  measuring$ = this.measuringSubject.asObservable();

  constructor(private mapService: MapService) {
    this.mapService.mapSubject.subscribe(map => this.map = map);
    this.setupStyles();
  }

  private setupInteraction(measureType: MeasureType): void {
    if (this.drawInteraction) {
      this.map.removeInteraction(this.drawInteraction);
    }

    this.drawInteraction = new Draw({
      source: this.measureSource,
      type: measureType,
      style: this.measureFeatureStyle
    });

    this.map.addInteraction(this.drawInteraction);

    this.createMeasureTooltip();
    this.createHelpTooltip();

    this.drawInteraction.on('drawstart', (event: ol.interaction.Draw.Event) => {
      this.measureFeature = event.feature;

      this.measureFeature.getGeometry().on('change', this.geometryChangeListener);
    });

    this.drawInteraction.on('drawend', (event: ol.interaction.Draw.Event) => {
      this.measureFeature = null;
      this.measureTooltipElement.className = 'tooltip tooltip-static';
      this.measureTooltip.setOffset([0, -7]);
      // unset tooltip so that a new one can be created
      this.measureTooltipElement = null;
      this.createMeasureTooltip();
      this.createHelpTooltip();
      olObservable.unByKey(this.geometryChangeListener);
    });
  }

  private geometryChangeListener = (event) => {
    const geometry = event.target;
    let output: string;
    let tooltipCoord: ol.Coordinate;
    if (geometry instanceof Polygon) {
      output = this.formatArea(geometry);
      tooltipCoord = geometry.getInteriorPoint().getCoordinates();
    } else {
      output = this.formatLength(geometry);
      tooltipCoord = geometry.getLastCoordinate();
    }
    this.measureTooltipElement.innerHTML = output;
    this.measureTooltip.setPosition(tooltipCoord);
  }

  changeMeasureType(measureType: MeasureType) {
    this.setupInteraction(measureType);
  }

  measureStart(): void {
    this.measuringSubject.next(true);
    this.setupLayer();
    this.setupInteraction(MeasureType.LineString);
    this.map.on('pointermove', this.onPointerMove);
    this.map.getViewport().addEventListener('mousout', () => {
      this.helpTooltipElement.classList.add('hidden');
    });
  }

  private onPointerMove = (event: MapBrowserEvent) => {
    if (event.dragging) {
      return;
    }
    let helpMessage = 'Click to start measuring';
    if (this.measureFeature) {
      helpMessage = 'Click to continue measuring<br />Double click to finish';
    }
    this.helpTooltipElement.innerHTML = helpMessage;
    this.helpTooltip.setPosition(event.coordinate);
    this.helpTooltipElement.classList.remove('hidden');
  }

  private createHelpTooltip() {
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'tooltip hidden';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    this.map.addOverlay(this.helpTooltip);
  }


  private createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  }

  measureEnd(): void {
    this.map.removeInteraction(this.drawInteraction);
    this.map.removeLayer(this.measureLayer);
    this.map.un('pointermove', this.onPointerMove);
    this.measuringSubject.next(false);
    this.measureTooltipElement = null;
    // remove tooltips overlay build-up
    const overlaysContainer = document.querySelector('.ol-overlaycontainer-stopevent');
    overlaysContainer.innerHTML = '';
  }

  private setupLayer(): void {
    this.measureSource = new VectorSource();

    this.measureLayer = new VectorLayer({
      source: this.measureSource,
      style: this.measureLayerStyle
    });

    this.map.addLayer(this.measureLayer);

  }

  private formatLength(line: Geometry) {
    const length = Sphere.getLength(line);
    let output: string;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  }

  private formatArea(polygon: Geometry) {
    const area = Sphere.getArea(polygon);
    let output: string;
    if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
    } else {
      output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
    }
    return output;
  }


  private setupStyles(): void {
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
