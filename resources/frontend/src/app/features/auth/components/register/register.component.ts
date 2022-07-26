import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from '../../../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { RegisterService } from '../../services/register.service';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    validateForm!: FormGroup;
    isLoading = false;

    constructor(private registerService: RegisterService, private router: Router, private fb: FormBuilder, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.email, Validators.required]),
            phoneNumber: new FormControl(null, [Validators.required]),
            street: new FormControl(null, []),
            website: new FormControl(null, [Validators.required]),
            address: new FormControl(null, [Validators.required]),
            companyName: new FormControl(null, [Validators.required]),
            postCode: new FormControl(null, [Validators.required]),
            city: new FormControl(null, [Validators.required]),
        });
    }

    onSaveCompany() {
        this.isLoading = true;
        if (this.validateForm.valid) {
            this.isLoading = true;
            let data = this.validateForm.value;
            data['isSubscriber'] = true;
            this.registerService.saveResources(sharedConstants.API_ENDPOINT + 'register', data)
                .subscribe(
                    {
                        next: (response: any) => {
                            this.createMessage('success', 'register success !');
                            this.router.navigate(['/auth/login']);
                        },
                        error: (error) => {
                            
                            error.error.errors.forEach((item : any) => {
                                this.createMessage('error', item);
                            });
                            
                            this.isLoading = false;
                        },
                        complete: () => {
                            this.isLoading = false;
                        }
                    }
                );
        } else {
            Object.values(this.validateForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                    this.isLoading = false;
                }
            });
        }
    }

    createMessage(type: string, message: any): void {
        this.message.create(type, ` ${message}`);
    }
}
