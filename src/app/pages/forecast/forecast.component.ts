import { Component, OnInit,ViewChild,ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-forecast',
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css'
})
export class ForecastComponent implements OnInit {
forecast(arg0: string) {
  this.router.navigateByUrl('forecast');
}
home(arg0: string) {
  this.router.navigateByUrl('/');
}
  @ViewChild('fileInput') fileInput!: ElementRef;// ใช้ ViewChild เพื่ออ้างอิง input file
  form: FormGroup;
  uploadedFile?: File;
  fileColumns: string[] = []; //  เพิ่มตัวแปรเก็บชื่อคอลัมน์
  fileRows: any[][] = []; //  เพิ่มตัวแปรเก็บข้อมูลแถวในไฟล์
  currentRoute: string = '';

  constructor(private fb: FormBuilder,private cd: ChangeDetectorRef,private router: Router) {
    this.form = this.fb.group({
      model: ['Random Forest'],
      period: ['รายปี'],
      riceType: ['นาปี'],
      startDate: ['2017-01-01'],
      endDate: ['2022-12-31']
    });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
   }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.uploadedFile = target.files[0];
      console.log('📂 อัปโหลดไฟล์:', this.uploadedFile.name);

      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!allowedTypes.includes(this.uploadedFile.type)) {
        alert('กรุณาเลือกไฟล์ที่เป็น .xls, .xlsx หรือ .csv เท่านั้น');
        this.uploadedFile = undefined;
        target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (jsonData.length > 0 && Array.isArray(jsonData[0])) {
          this.fileColumns = jsonData[0].map(String);
        } else {
          this.fileColumns = [];
        }

        this.fileRows = jsonData.length > 1 ? jsonData.slice(1, 6) : [];

        console.log('📊 คอลัมน์:', this.fileColumns);
        console.log('📄 ข้อมูล:', this.fileRows);
      };

      reader.readAsArrayBuffer(this.uploadedFile);
      this.cd.detectChanges(); // ✅ บังคับให้ UI อัปเดต
    }
  }

  removeFile() {
    console.log('❌ ลบไฟล์:', this.uploadedFile?.name);
    this.uploadedFile = undefined;
    this.fileColumns = [];
    this.fileRows = [];

    setTimeout(() => {
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }, 0);
    
    this.cd.detectChanges(); // ✅ บังคับให้ UI อัปเดต
  }


  submitForm() {
    console.log('📩 ส่งแบบฟอร์ม:', this.form.value);
    console.log('📂 ไฟล์ที่อัปโหลด:', this.uploadedFile);
    console.log('📊 คอลัมน์:', this.fileColumns);
    console.log('📄 แถวข้อมูล:', this.fileRows);
  }
}

