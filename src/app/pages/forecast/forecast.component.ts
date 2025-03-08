import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forecast',
  imports: [CommonModule ],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.css'
})
export class ForecastComponent implements OnInit {
  form: FormGroup;
  uploadedFile?: File;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      model: ['Random Forest'],
      period: ['รายปี'],
      riceType: ['นาปี'],
      startDate: ['2017-01-01'],
      endDate: ['2022-12-31']
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.uploadedFile = target.files[0];
    }
  }

  submitForm() {
    console.log('Form Data:', this.form.value);
    console.log('Uploaded File:', this.uploadedFile);
  }
}

