import { Component, OnInit, AfterViewInit } from '@angular/core';

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



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  map: Map;

  mapExtent = proj.transformExtent([-4, 50, 1, 60], 'EPSG:4326', 'EPSG:3857');

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.setupMap();
    this.addWMS();
  }

  private setupMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
    this.map.getView().fit(this.mapExtent);
  }

  private addWMS() {
    const wmsURl = 'https://staging.ows.emodnet-seabedhabitats.eu/emodnet/wms';

    const substrateSource = new TileWMS({
      url: wmsURl,
      params: {'LAYERS': 'eusm_sub'}
    });

    const biologicalZoneSource = new TileWMS({
      url: wmsURl,
      params: {'LAYERS': 'eusm_bio', 'TILED': true},
    });

    const substrateLayer = new Tile({
      source: substrateSource
    });

    const biologicalZoneLayer = new Tile({
      source: biologicalZoneSource
    });

    this.map.addLayer(substrateLayer);
  }

}
