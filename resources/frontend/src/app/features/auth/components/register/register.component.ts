import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { RegisterService } from '../../services/register.service';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    validateForm!: FormGroup;

    constructor(private registerService: RegisterService, private router: Router, private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            firstName:new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.email , Validators.required]),
            phoneNumber: new FormControl(null, [Validators.required]),
            street: new FormControl(null, [Validators.required]),
            website: new FormControl(null, [Validators.required]),
            adress: new FormControl(null, [Validators.required]),
            companyName: new FormControl(null, [Validators.required]),
        });
    }

    onSaveCompany() {
        if (this.validateForm.valid) {
            let data = this.validateForm.value;
            data['isSubscriber'] = true;
            this.registerService.saveResources(sharedConstants.API_ENDPOINT + 'register', data)
                .subscribe(res => {
                    this.router.navigate(['/auth/login']);
                }, err => {
                    console.log(err);
                }
                )
        } else {
            Object.values(this.validateForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }
}
