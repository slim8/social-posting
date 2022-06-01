import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoginResponse } from 'ngx-facebook';
import { FacebookSocialService } from 'src/app/features/facebook-social/services/facebook-social.service';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { AccountsService } from '../../services/accounts.service';

@Component({
    selector: 'app-accounts-management',
    templateUrl: './accounts-management.component.html',
    styleUrls: ['./accounts-management.component.scss']
})
export class AccountsManagementComponent implements OnInit {

    connectedAccounts: any = []
    private user = {
        accessToken: '',
        id: '',
        pages: [],
    };
    listpages: any;
    isVisible = false;
    validateForm!: FormGroup;

    constructor(private accountsService: AccountsService,
        private service: FacebookSocialService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.validateForm = this.formBuilder.group({
            myChoices: new FormArray([]),
        });

        this.accountsService.getConnectedAccounts().subscribe({
            next: (response: any) => {
                console.log(response)
                this.connectedAccounts = response.accounts
            },
            error: err => {
                console.log(err)
            },
            complete: () => {
                // console.log('done')
            }
        })
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
                        sharedConstants.API_ENDPOINT + '/get-meta-pages-groups',
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
        console.log('Button ok clicked!');
        this.isVisible = false;
    }

    handleCancel(): void {
        console.log('Button cancel clicked!');
        this.isVisible = false;
    }

    onSubmit() {
        if (this.validateForm.valid) {
            console.log(this.validateForm.value);

            console.log('this.listpages', this.listpages);

            let selectedobject = this.listpages.filter((item: any) =>
                this.validateForm.value.myChoices.includes(item.pageId)
            );
            console.log(selectedobject);
            this.service
                .manageFacebookPages(
                    sharedConstants.API_ENDPOINT + '/save-meta-pages-groups',
                    {
                        pages: selectedobject,
                        user: this.user.id
                    }
                )
                .subscribe((response: any) => {

                    console.log('saveFacebookPages');
                    console.log(response);
                });

            this.validateForm = this.formBuilder.group({
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
