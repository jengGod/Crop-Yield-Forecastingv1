import {Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule ,FormsModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  form: FormGroup;
  provinceLocations!: { [key: string]: [number, number] };
  toggleDropdown(type: keyof typeof this.dropdowns) {
    this.dropdowns[type] = !this.dropdowns[type];  
  }
  
  constructor(private router: Router) {
    this.form = new FormGroup({
      province: new FormControl('', { nonNullable: true }) // ✅ ป้องกัน null ได้เลย
    });
    }
forecast(arg0: string) {
 this.router.navigateByUrl('forecast');
}
home(arg0: string) {
  this.router.navigateByUrl('');
}

  map!: L.Map; // ตัวแปรสำหรับเก็บแผนที่
  markersLayer: any;
  legendVisible: boolean = false;
  currentRoute: string = '';

  dropdownprovinces: string[] = [
    'กาฬสินธุ์', 'ขอนแก่น', 'ชัยภูมิ', 'นครพนม', 'นครราชสีมา',
    'บึงกาฬ', 'บุรีรัมย์', 'มหาสารคาม', 'มุกดาหาร', 'ยโสธร',
    'ร้อยเอ็ด', 'ศรีสะเกษ', 'สกลนคร', 'สุรินทร์', 'หนองคาย',
    'หนองบัวลำภู','เลย', 'อำนาจเจริญ', 'อุดรธานี', 'อุบลราชธานี'
  ];
  dropdowns: Record<string, boolean> = {
    soil: false,
    weather: false,
    rice: false
  };

  // ตัวเลือกของแต่ละกลุ่ม
  soilOptions = ['ความชื้นในดิน', 'ค่า PH ของดิน', 'ชนิดของดิน'];
  weatherOptions = ['NDVI', 'ปริมาณน้ำฝน', 'อุณหภูมิสูงสุด/ต่ำสุด', 'ความชื้นสัมพัทธ์'];
  riceOptions = ['ข้าวนาปี', 'ข้าวนาปรัง'];

  // เก็บค่าที่เลือก
  selectedSoil: { [key: string]: boolean } = {};
  selectedWeather: { [key: string]: boolean } = {};
  selectedRice: { [key: string]: boolean } = {};


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
    this.provinceLocations = this.provinces?.reduce((acc, p) => {
      if (p.name && p.lat && p.lng) {
        acc[p.name] = [p.lat, p.lng];
      }
      return acc;
    }, {} as { [key: string]: [number, number] });
   this.initMap();
    this.currentRoute = this.router.url;

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
    this.form.get('province')?.valueChanges.subscribe(province => {
      this.updateMap(province);
    });
    
  }
  updateMap(province: string) {
    if (!this.map) return;
  
    // ตรวจสอบว่า markersLayer ถูกกำหนดหรือไม่
    if (!this.markersLayer) {
      this.markersLayer = L.layerGroup().addTo(this.map);
    }
  
    // ลบหมุดเก่าทั้งหมด
    this.markersLayer.clearLayers();
  
    // ตรวจสอบว่ามีข้อมูล lat, lng ของจังหวัดที่เลือกหรือไม่
    if (this.provinceLocations && this.provinceLocations[province]) { 
      const [lat, lng] = this.provinceLocations[province]; 
      const marker = L.marker([lat, lng]).addTo(this.markersLayer);
      this.map.setView([lat, lng], 8);
    }
  }
  
  
  private initMap(): void {
    if (this.map) {
      this.map.remove(); // ป้องกันการสร้างแผนที่ซ้ำซ้อน
    }
  
    this.map = L.map('map', {
      center: [16.0, 103.0],
      zoom: 7,
      zoomControl: false
    });
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }).addTo(this.map);
  
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
  
    // ใช้ LayerGroup สำหรับจัดการ Marker
    this.markersLayer = L.layerGroup().addTo(this.map);
  
    const blueIcon = L.icon({
      iconUrl: 'assets/gps_blue.png',
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [1, -34]
    });
  
    this.provinces.forEach(province => {
      L.marker([province.lat, province.lng], { icon: blueIcon })
        .addTo(this.markersLayer)
        .bindPopup(province.name);
    });
  }
  updateMarkers(province: string) {
    if (!this.map) return;
  
    // ลบหมุดเก่าทั้งหมด
    this.markersLayer.clearLayers();
  
    if (this.provinceLocations && this.provinceLocations[province]) {
      const [lat, lng] = this.provinceLocations[province];
  
      const blueIcon = L.icon({
        iconUrl: 'assets/gps_blue.png',
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [1, -34]
      });
  
      // เพิ่มเฉพาะหมุดของจังหวัดที่เลือก
      L.marker([lat, lng], { icon: blueIcon })
        .addTo(this.markersLayer)
        .bindPopup(province);
  
      this.map.setView([lat, lng], 8);
    }
  }
  // เรียกใช้เมื่อ dropdown เปลี่ยนค่า
  

  private addAllProvinces() {
    const blueIcon = L.icon({
      iconUrl: 'assets/upload.png', 
      iconSize: [30, 45],
      iconAnchor: [15, 45],
      popupAnchor: [1, -34]
    });
  
    this.provinces.forEach(province => {
      L.marker([province.lat, province.lng], { icon: blueIcon })
        .addTo(this.markersLayer)
        .bindPopup(province.name);
    });
  }

  toggleLegend(): void {
    this.legendVisible = !this.legendVisible;
  }
  private showDropdowns(): void {
    this.dropdowns['soil'] = true;
    this.dropdowns['weather'] = true;
    this.dropdowns['rice'] = true;
  }
  
  private hideDropdowns(): void {
    this.dropdowns['soil'] = false;
    this.dropdowns['weather'] = false;
    this.dropdowns['rice'] = false;
  }
  
}
