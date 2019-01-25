import { Component, OnInit, OnDestroy } from '@angular/core';

 import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/tilewms';
import Image from 'ol/layer/image';
import ImageWMS from 'ol/source/imagewms';
import GeoJSON from 'ol/format/GeoJSON';
import proj from 'ol/proj';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Select from 'ol/interaction/select';
import condition from 'ol/events/condition';
import OverviewMap from 'ol/control/OverviewMap';
import { MapService } from '../map.service';
import ImageLayer from 'ol/layer/image';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  map: Map;
  private zoomExtentSubscription: Subscription;

  mapExtent = proj.transformExtent([-4, 50, 1, 60], 'EPSG:4326', 'EPSG:3857');

  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    this.setupMap();
    this.addWMS();
  }

  private setupMap() {
    const view = new View({
      center: proj.fromLonLat([0, 50]),
      zoom: 4,
      maxZoom: 17,
      minZoom: 3
  });

  const baseLayer = new Tile({
    source: new OSM()
  });

    this.map = new Map({
      target: 'map',
      controls: [],
      layers: [
        baseLayer
      ],
      view: view
    });
    this.map.getView().fit(this.mapExtent);
    this.mapService.mapReady(this.map);

    this.map.on('click', () => {
      this.mapService.getFeatureInfo();
    });

    this.zoomExtentSubscription = this.mapService.zoomExtent.subscribe(() =>
      this.map.getView().fit(this.mapExtent)
    );
  }

  ngOnDestroy() {
    if (this.zoomExtentSubscription) {
      this.zoomExtentSubscription.unsubscribe();
    }
  }

  private addWMS() {
    // const wmsURl = 'https://ows.emodnet-seabedhabitats.eu/emodnet/wms';
    const wmsURl = 'https://jnccdev-geo.esdm.co.uk/emodnet/wms';

    const substrateSource = new TileWMS({
      url: wmsURl,
      params: {'LAYERS': 'eusm_sub'}
    });

    const biologicalZoneSource = new TileWMS({
      url: wmsURl,
      params: {'LAYERS': 'eusm_bio'},
    });

    const substrateLayer = new Tile({
      source: substrateSource
    });

    // const imageLayer =  new ImageLayer({
    //   source: new ImageWMS({
    //     url: wmsURl,
    //     params: {'LAYERS': 'eusm_sub'},
    //     ratio: 1
    //   })
    // });

    const biologicalZoneLayer = new Tile({
      source: biologicalZoneSource
    });

    this.map.addLayer(substrateLayer);
  }

}
