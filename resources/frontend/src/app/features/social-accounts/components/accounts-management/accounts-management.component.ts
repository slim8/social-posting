import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSkeletonInputSize } from 'ng-zorro-antd/skeleton';
import { LoginResponse } from 'ngx-facebook';
import { FacebookSocialService } from 'src/app/features/facebook-social/services/facebook-social.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { AccountsService } from '../../services/accounts.service';
import { AccountsManagementAnimations } from 'src/app/shared/animations/accounts-management-animations';
@Component({
    selector: 'app-accounts-management',
    templateUrl: './accounts-management.component.html',
    styleUrls: ['./accounts-management.component.scss'],
    animations: [AccountsManagementAnimations]
})
export class AccountsManagementComponent implements OnInit {
    isWaiting: boolean = false;
    isLoading: boolean = false;
    connectedAccounts: any = [];
    elementActive = true;
    elementSize: NzSkeletonInputSize = 'small';
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
        private modal: NzModalService,
        private sharedModule: SharedModule) { }

    ngOnInit(): void {
        this.validateForm = this.formBuilder.group({
            myChoices: new FormArray([]),
        });
        this.getConnectedAccounts();
    }

    preventMessage(msg: any) {

        if (msg) {
            this.sharedModule.createMessage('error', msg);
        }
    }


    loginWithFacebook() {
        this.isWaiting = true;

        this.service
            .loginWithFacebook()
            .then((res: LoginResponse) => {
                this.user = {
                    ...this.user,
                    accessToken: res.authResponse.accessToken,
                    id: res.authResponse.userID,
                };
                this.service.manageFacebookPages(sharedConstants.API_ENDPOINT + 'get-meta-pages-groups', {
                    accessToken: this.user.accessToken,
                    id: this.user.id,
                }).subscribe((response: any) => {
                    this.listpages = response.pages;
                    this.getConnectedAccounts();
                    this.isWaiting = false;

                    if (this.listpages) {

                        if (this.listpages.length > 0) {
                            this.showModal();
                        } else {
                            this.preventMessage(response.message);
                        }
                    } else {
                        this.preventMessage(response.message);
                    }


                });
            })
            .catch(() => console.warn('error'))
            .finally(() => {
                this.isWaiting = false;
            });
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
                sharedConstants.API_ENDPOINT + 'save-meta-pages-groups',
                {
                    pages: selectedobject,
                    user: this.user.id
                }
            )
                .subscribe((response: any) => {
                    this.sharedModule.createMessage('success', 'Success!');
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
                this.connectedAccounts = response.accounts
            },
            error: err => {
                this.connectedAccounts = []
            },
            complete: () => {
                this.getConnectedAccounts();
            }
        })
    }

    getConnectedAccounts() {
        this.isWaiting = true;
        this.isLoading = true;

        setTimeout(() => {
            this.accountsService.getConnectedAccounts().subscribe({
                next: (response: any) => {
                    this.connectedAccounts = response.accounts;
                },
                error: (err) => {
                    this.connectedAccounts = [];
                    this.isWaiting = false;
                    this.isLoading = false;
                },
                complete: () => {
                    this.isWaiting = false;
                    this.isLoading = false;
                }
            })
        }, 2000);

    }


    showDisconnectConfirm(id: any): void {
        this.modal.confirm({
            nzTitle: 'Do you really want to disconnect this account?',
            nzContent: '<b style="color: red;">You will have to connect this acocunt via facebook to reconnect</b>',
            nzOkText: 'Yes',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.disconnect(id),
            nzCancelText: 'No',
            nzOnCancel: () => console.warn('Cancel')
        });
    }
}
