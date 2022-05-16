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
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  constructor(private companyService:CompanyService, private router:Router, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+86'],
      phoneNumber: [null, [Validators.required]],
      website: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      agree: [false]
    });
  }

  onSaveCompany() {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.companyService.saveResources(environment.apiURL + 'register', this.validateForm.value)
        .subscribe(res => {
          }, err => {
            console.log(err);
          }
        )
    } else {
      console.log("else");
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }

    // let data = {
    //   "firstName": "firstName",
    //   "lastName": "lastName",
    //   "phoneNumber": "1234568789",
    //   "email": "email@gamil.com",
    //   "adress": "adress",
    //   "companyName": "company name",
    //   "website": "website",
    //   "isSubscriber": "true"
    // };
  }


  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls['checkPassword']);
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return {required: true};
    } else if (control.value !== this.validateForm.controls['checkPassword'].value) {
      return {confirm: true, error: true};
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
}
