import {Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import { Router, RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { HttpClient, } from '@angular/common/http';
@Component({
  selector: 'app-home',
  imports: [CommonModule, ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  map!: L.Map; // ตัวแปรสำหรับเก็บแผนที่
  legendVisible: boolean = false;

  provinces = [
    { name: 'ขอนแก่น', lat: 16.42, lng: 102.83 },
    { name: 'นครราชสีมา', lat: 14.97, lng: 102.1 },
    { name: 'อุบลราชธานี', lat: 15.24, lng: 104.85 },
    { name: 'อุดรธานี', lat: 17.41, lng: 102.79 },
    { name: 'มหาสารคาม', lat: 16.18, lng: 103.29 },
    { name: 'ร้อยเอ็ด', lat: 16.05, lng: 103.65 },
    { name: 'บุรีรัมย์', lat: 15.0, lng: 103.1 },
    { name: 'สุรินทร์', lat: 14.88, lng: 103.49 },
    { name: 'ศรีสะเกษ', lat: 15.12, lng: 104.33 },
    { name: 'หนองคาย', lat: 17.88, lng: 102.74 },
    { name: 'หนองบัวลำภู', lat: 17.22, lng: 102.43 },
    { name: 'เลย', lat: 17.49, lng: 101.72 },
    { name: 'สกลนคร', lat: 17.15, lng: 104.14 },
    { name: 'นครพนม', lat: 17.39, lng: 104.78 },
    { name: 'ชัยภูมิ', lat: 15.8, lng: 102.03 },
    { name: 'กาฬสินธุ์', lat: 16.43, lng: 103.51 },
    { name: 'มุกดาหาร', lat: 16.54, lng: 104.72 },
    { name: 'ยโสธร', lat: 15.79, lng: 104.15 },
    { name: 'บึงกาฬ', lat: 18.36, lng: 103.64 },
    { name: 'อำนาจเจริญ', lat: 15.85, lng: 104.63 }
  ];

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [16.0, 103.0],
      zoom: 7,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    // ไอคอน Marker ตามระดับผลผลิต
    const blueIcon = L.icon({
      iconUrl: 'assets/gps_blue.png', 
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [1, -34]
    });
    this.provinces.forEach(province => {
      L.marker([province.lat, province.lng], { icon: blueIcon })
        .addTo(this.map)
        .bindPopup(province.name);
    });
  }

  toggleLegend(): void {
    this.legendVisible = !this.legendVisible;
  }
}
