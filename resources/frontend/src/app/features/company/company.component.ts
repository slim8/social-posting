import {Component, OnInit} from '@angular/core';
import {CompanyService} from "./services/company.service";
import {Router} from "@angular/router";
import {environment} from '../../../environments/environment';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NzFormTooltipIcon} from 'ng-zorro-antd/form';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})

export class CompanyComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(private companyService:CompanyService, private router:Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      phoneNumber: [null, [Validators.required]],
      website: [null, [Validators.required]],
      adress: [null, [Validators.required]],
      companyName: [null, [Validators.required]],
    });
  }

  onSaveCompany() {
    if (this.validateForm.valid) {
      let data = this.validateForm.value ;
      data['isSubscriber'] = true;
      this.companyService.saveResources(environment.apiURL + 'register', data)
        .subscribe(res => {
          }, err => {
            console.log(err);
          }
        )
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
