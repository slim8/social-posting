import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
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
        private formBuilder: FormBuilder,
        private modal: NzModalService) { }

    ngOnInit(): void {
        this.validateForm = this.formBuilder.group({
            myChoices: new FormArray([]),
        });
        this.getConnectedAccounts();
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
                this.getConnectedAccounts();
                this.service.manageFacebookPages(sharedConstants.API_ENDPOINT + '/get-meta-pages-groups', {
                    accessToken: this.user.accessToken,
                    id: this.user.id,
                }).subscribe((response: any) => {
                    this.listpages = response.pages;
                    this.getConnectedAccounts();
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

            this.service.manageFacebookPages(
                    sharedConstants.API_ENDPOINT + '/save-meta-pages-groups',
                    {
                        pages: selectedobject,
                        user: this.user.id
                    }
                )
                .subscribe((response: any) => {
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

    disconnect(id: string) {
        this.accountsService.disconnectAccountById(id).subscribe({
            next: (response: any) => {
                console.log(response)
                this.connectedAccounts = response.accounts
            },
            error: err => {
                console.log(err)
                this.connectedAccounts = []
            },
            complete: () => {
                this.getConnectedAccounts();
            }
        })
    }

    getConnectedAccounts() {
        this.accountsService.getConnectedAccounts().subscribe({
            next: (response: any) => {
                this.connectedAccounts = response.accounts;
            },
            error: err => {
                console.log(err)
            },
            complete: () => {
                console.log(this.connectedAccounts);
            }
        })
    }


    showDisconnectConfirm( id : any): void {
        this.modal.confirm({
          nzTitle: 'Do you really want to disconnect this account?',
          nzContent: '<b style="color: red;">You will have to connect this acocunt via facebook to reconnect</b>',
          nzOkText: 'Yes',
          nzOkType: 'primary',
          nzOkDanger: true,
          nzOnOk: () => this.disconnect(id),
          nzCancelText: 'No',
          nzOnCancel: () => console.log('Cancel')
        });
      }
}
