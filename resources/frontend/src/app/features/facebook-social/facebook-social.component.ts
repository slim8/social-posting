import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'ngx-facebook';
import { FacebookSocialService } from './services/facebook-social.service';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Component({
    selector: 'app-facebook-social',
    templateUrl: './facebook-social.component.html',
    styleUrls: ['./facebook-social.component.scss'],
})
export class FacebookSocialComponent implements OnInit {
    private formData: FormData = new FormData();
    private user = {
        accessToken: '',
        id: '',
        pages: [],
    };

    isVisible = false;
    listpages: any;
    validateForm!: FormGroup;
    userInfo = ''

    constructor(
        private service: FacebookSocialService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.service.getLoginStatus();
        this.validateForm = this.fb.group({
            myChoices: new FormArray([]),
        });
    }

    loginWithFacebook() {
        this.service
            .loginWithFacebook()
            .then((res: LoginResponse) => {
                this.user = {
                    ...this.user,
                    accessToken: res.authResponse.accessToken,
                    id: res.authResponse.userID,
                };

                this.service
                    .manageFacebookPages(
                        sharedConstants.API_ENDPOINT + 'get-meta-pages-groups',
                        {
                            accessToken: this.user.accessToken,
                            id: this.user.id,
                        }
                    )
                    .subscribe((response: any) => {
                        this.listpages = response.pages;
                        this.showModal();
                    });
            })
            .catch(() => console.error('error'));
    }

    showModal(): void {
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    onSubmit() {
        if (this.validateForm.valid) {
            let selectedobject = this.listpages.filter((item: any) =>
                this.validateForm.value.myChoices.includes(item.pageId)
            );
            this.service
                .manageFacebookPages(
                    sharedConstants.API_ENDPOINT + 'save-meta-pages-groups',
                    {
                        pages: selectedobject,
                        user: this.user.id
                    }
                )
                .subscribe((response: any) => {
                });

            this.validateForm = this.fb.group({
                myChoices: new FormArray([]),
            });
            this.isVisible = false;
        } else {
            Object.values(this.validateForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    onCheckChange(event: any) {
        const formArray: FormArray = this.validateForm.get(
            'myChoices'
        ) as FormArray;
        if (event.target.checked) {
            formArray.push(new FormControl(event.target.value));
        }
    }
}
