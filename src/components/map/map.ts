import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class Map implements AfterViewInit {

  private map: any;

  // Coordinate per Via del Parco Magnolie, 61, 80013 Casalnuovo di Napoli (NA)
  private lat = 40.8980;
  private lon = 14.3355;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ this.lat, this.lon ],
      zoom: 16
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    const marker = L.marker([ this.lat, this.lon ]);
    marker.addTo(this.map);
    marker.bindPopup("<b>De Luca Costruzioni S.R.L.</b><br>Via del Parco Magnolie, 61<br>80013 Casalnuovo di Napoli (NA)").openPopup();
  }
}