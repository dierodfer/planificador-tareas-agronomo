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

  location; // Ubicación en coordenadas actual del dispositivo
  map: Map; // Mapa
  vectorLayer: VectorLayer; // Capa de iconos(features) añadido al mapa
  @Output() action = new EventEmitter(); // Valor que recibe el componente padre tras alguna acción
  @Input() register; // Define el tipo de acciones que tendrá el mapa
  @Input() coordinates; // Coordinadas recibidas del componente padre para mostrar
  vectorSource: VectorSource;
  view: View;

  constructor() { }

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
        new VectorLayer({
          source : this.vectorSource = new VectorSource({})
        })
      ],
      view: this.view = new View({
        center: fromLonLat([0 , 0]),
        zoom: 5,
        minZoom: 5,
      })
    });
  }

  setLayers(longitude, latitude) {
    this.addFeatureLocation(longitude, latitude);
    if (!this.register) {
      this.addFeatureWarning();
      this.setView(this.coordinates.longitude, this.coordinates.latitude);
    } else {
      this.setView(longitude, latitude);
    }
    this.location = {
      longitude: longitude,
      latitude: latitude
    };
  }

  setView(longitude, latitude) {
    this.view.setCenter(fromLonLat([longitude, latitude]));
    this.view.setZoom(13);
  }

  addFeatureLocation(longitude, latitude) {
    this.vectorSource.addFeature(this.getLocationIcon(longitude, latitude));
  }

  addFeatureWarning() {
    this.vectorSource.addFeature(this.getWarningIcon());
  }

    // function that gets the location and returns it
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setLayers(position.coords.longitude, position.coords.latitude);
      });
    } else {
      /* this.error = 'Su navegador no soporta geolocalizacion'; */
    }
  }

  getLocationIcon(longitude, latitude) {
    const feature = new Feature(new Point(fromLonLat([longitude, latitude])));
    feature.setStyle(this.getLocationStyle());
    return feature;
  }

  getLocationStyle() {
    return new Style({
      image: new Icon(({
        anchor: [0.5, 0.96],
        src: 'https://raw.githubusercontent.com/dierodfer/public/master/location.png',
      }))
    });
  }

  getWarningIcon() {
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
    this.vectorSource.clear();
    this.getLocation();
  }

  miLocalizacion() {
    if (location) {
      this.setView(this.location.longitude, this.location.latitude);
    } else {
      this.getLocation();
    }
  }

  verIncidencia() {
    this.setView(this.coordinates.longitude, this.coordinates.latitude);
  }

  goBack() {
    this.action.emit('close');
  }

  submit() {
    this.action.emit(this.location);
  }

  ngOnInit() {
    this.getMap();
    this.getLocation();
  }

}
