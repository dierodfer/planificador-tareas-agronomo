import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style';
import Feature from 'ol/Feature';
import {Point} from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import {Vector as VectorSource} from 'ol/source';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  location;
  map: Map;
  vectorLayer: VectorLayer;
  @Output() action = new EventEmitter();
  @Input() register;
  @Input() coordinates;

  getPositionIcon() {
    const positionFeature = new Feature();
      positionFeature.setStyle(new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: '#3399CC'
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2
          })
        })
      }));
  }

  setView(longitude, latitude) {
    this.addLayerLocation(longitude, latitude);
    if (!this.register) {
      this.addLayerWarning();
    }
    this.map.setView(new View({
      center: fromLonLat([longitude, latitude]),
      zoom: 18,
      minZoom: 5,
    }));
    this.location = {
      longitude: longitude,
      latitude: latitude
    };
  }

  getPoint(longitude, latitude) {
    const feature = new Feature(new Point(fromLonLat([longitude, latitude])));
    feature.setStyle(this.getStyle());
    return feature;
  }

  getStyle() {
    return new Style({
      image: new Icon(({
        anchor: [0.5, 0.96],
        src: 'https://raw.githubusercontent.com/dierodfer/public/master/location.png',
      }))
    });
  }

  getWarning() {
    const feature = new Feature(new Point(fromLonLat([this.coordinates.longitude, this.coordinates.latitude])));
    feature.setStyle(this.getStyleWarning());
    return feature;
  }

  getStyleWarning() {
    return new Style({
      image: new Icon(({
        anchor: [0.5, 0.96],
        src: 'https://raw.githubusercontent.com/dierodfer/public/master/p.png',
      }))
    });
  }

  addLayerLocation(longitude, latitude) {
    this.map.removeLayer(this.vectorLayer);
    this.map.addLayer(
      this.vectorLayer = new VectorLayer({
        source : new VectorSource({
          features: [this.getPoint(longitude, latitude)]
        })
      })
    );
  }

  addLayerWarning() {
    this.map.addLayer(
      new VectorLayer({
        source : new VectorSource({
          features: [this.getWarning()]
        })
      })
    );
  }

  getMap() {
    this.map = new Map({
      target: 'map',
      layers: [
        // Capa principal
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=e89915a4e7ba46fd9956c3251518f304'
          })
        }),
      ],
      view: new View({
        center: fromLonLat([0 , 0]),
        zoom: 5,
        minZoom: 5,
      })
    });
  }

  constructor() { }

    // function that gets the location and returns it
  getLocationView() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setView(position.coords.longitude, position.coords.latitude);
      });
    } else {
      /* this.error = 'Su navegador no soporta geolocalizacion'; */
    }
  }
  getURLGoogleMaps(): string {
    let res;
    if (this.location && this.coordinates) {
      res = 'https://www.google.com/maps/dir/' + this.location.latitude + ',' + this.location.longitude
      + '/' + this.coordinates.latitude + ',' + this.coordinates.longitude;
    } else {
      res = '';
    }
    return res;
  }

  recalcular() {
    this.getLocationView();
  }

  goBack() {
    this.action.emit('close');
  }

  submit() {
    this.action.emit(this.location);
  }

  ngOnInit() {
    // request for location
    this.getMap();
    this.getLocationView();
    if (!this.register) {
    }
  }

}
