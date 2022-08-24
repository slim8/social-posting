import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginResponse } from 'ngx-facebook';
import { SharedModule } from 'src/app/shared/shared.module';
import { sharedConstants } from 'src/app/shared/sharedConstants';

import { FacebookSocialService } from '../facebook-social/services/facebook-social.service';
import { AccountsService } from '../social-accounts/services/accounts.service';

const addIcon = '<svg width="64" height="67" viewBox="0 0 64 67" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.874837 59.8333C0.874837 61.6513 2.34857 63.125 4.1665 63.125C5.98444 63.125 7.45817 61.6513 7.45817 59.8333H0.874837ZM32.9686 43.375C34.7865 43.375 36.2603 41.9013 36.2603 40.0833C36.2603 38.2654 34.7865 36.7917 32.9686 36.7917V43.375ZM52.0126 39.9664C52.0126 38.1485 50.5389 36.6747 48.7209 36.6747C46.903 36.6747 45.4293 38.1485 45.4293 39.9664H52.0126ZM45.4293 63.242C45.4293 65.0599 46.903 66.5337 48.7209 66.5337C50.5389 66.5337 52.0126 65.0599 52.0126 63.242H45.4293ZM60.3587 54.8959C62.1767 54.8959 63.6504 53.4221 63.6504 51.6042C63.6504 49.7863 62.1767 48.3125 60.3587 48.3125V54.8959ZM37.0831 48.3125C35.2652 48.3125 33.7915 49.7863 33.7915 51.6042C33.7915 53.4221 35.2652 54.8959 37.0831 54.8959V48.3125ZM7.45817 59.8333V56.5417H0.874837V59.8333H7.45817ZM37.0832 17.0417C37.0832 22.4955 32.662 26.9167 27.2082 26.9167V33.5C36.2979 33.5 43.6665 26.1314 43.6665 17.0417H37.0832ZM27.2082 26.9167C21.7544 26.9167 17.3332 22.4955 17.3332 17.0417H10.7498C10.7498 26.1314 18.1185 33.5 27.2082 33.5V26.9167ZM17.3332 17.0417C17.3332 11.5879 21.7544 7.16667 27.2082 7.16667V0.583333C18.1185 0.583333 10.7498 7.95198 10.7498 17.0417H17.3332ZM27.2082 7.16667C32.662 7.16667 37.0832 11.5879 37.0832 17.0417H43.6665C43.6665 7.95198 36.2979 0.583333 27.2082 0.583333V7.16667ZM45.4293 39.9664V51.6042H52.0126V39.9664H45.4293ZM45.4293 51.6042V63.242H52.0126V51.6042H45.4293ZM48.7209 54.8959H60.3587V48.3125H48.7209V54.8959ZM48.7209 48.3125H37.0831V54.8959H48.7209V48.3125ZM7.45817 56.5417C7.45817 49.2699 13.3531 43.375 20.6248 43.375V36.7917C9.71721 36.7917 0.874837 45.634 0.874837 56.5417H7.45817ZM20.6248 43.375H32.9686V36.7917H20.6248V43.375Z" fill="#E2E2E2"/></svg>';
const exclamationIcon = '<svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13.96C13 13.4077 12.5523 12.96 12 12.96C11.4477 12.96 11 13.4077 11 13.96H13ZM11 16.96C11 17.5122 11.4477 17.96 12 17.96C12.5523 17.96 13 17.5122 13 16.96H11ZM11 13.96V16.96H13V13.96H11Z" fill="#FF8D69"/><circle cx="12" cy="11" r="1" fill="#FF8D69"/><path d="M3.83827 18.5097L11.1284 5.54947C11.5107 4.86982 12.4893 4.86982 12.8716 5.54947L20.1617 18.5097C20.5367 19.1763 20.055 20 19.2902 20H4.70985C3.94502 20 3.46331 19.1763 3.83827 18.5097Z" stroke="#FF8D69" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const logoutIcon = '<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.8604 11.9535C10.8604 11.5168 10.5064 11.1628 10.0697 11.1628C9.63305 11.1628 9.27905 11.5168 9.27905 11.9535H10.8604ZM9.27905 5.28196C9.27905 5.71865 9.63305 6.07266 10.0697 6.07266C10.5064 6.07266 10.8604 5.71865 10.8604 5.28196H9.27905ZM6.90695 7.60463C6.47026 7.60463 6.11626 7.95864 6.11626 8.39533C6.11626 8.83202 6.47026 9.18603 6.90695 9.18603V7.60463ZM14.8139 8.39533L15.373 8.95444C15.6818 8.64565 15.6818 8.14501 15.373 7.83622L14.8139 8.39533ZM13.3963 5.85948C13.0875 5.55069 12.5869 5.55069 12.2781 5.85948C11.9693 6.16827 11.9693 6.66891 12.2781 6.9777L13.3963 5.85948ZM12.2781 9.81297C11.9693 10.1218 11.9693 10.6224 12.2781 10.9312C12.5869 11.24 13.0875 11.24 13.3963 10.9312L12.2781 9.81297ZM2.95347 2.06975H8.48835V0.488355H2.95347V2.06975ZM8.48835 14.7209H2.95347V16.3023H8.48835V14.7209ZM2.16277 13.9302V2.86045H0.581373V13.9302H2.16277ZM9.27905 11.9535V13.9302H10.8604V11.9535H9.27905ZM6.90695 9.18603H14.8139V7.60463H6.90695V9.18603ZM15.373 7.83622L13.3963 5.85948L12.2781 6.9777L14.2548 8.95444L15.373 7.83622ZM14.2548 7.83622L12.2781 9.81297L13.3963 10.9312L15.373 8.95444L14.2548 7.83622ZM2.95347 14.7209C2.51678 14.7209 2.16277 14.3669 2.16277 13.9302H0.581373C0.581373 15.2403 1.6434 16.3023 2.95347 16.3023V14.7209ZM8.48835 16.3023C9.79842 16.3023 10.8604 15.2403 10.8604 13.9302H9.27905C9.27905 14.3669 8.92504 14.7209 8.48835 14.7209V16.3023ZM8.48835 2.06975C8.92504 2.06975 9.27905 2.42376 9.27905 2.86045H10.8604C10.8604 1.55038 9.79842 0.488355 8.48835 0.488355V2.06975ZM2.95347 0.488355C1.64339 0.488355 0.581373 1.55038 0.581373 2.86045H2.16277C2.16277 2.42376 2.51678 2.06975 2.95347 2.06975V0.488355ZM9.27905 2.86045V5.28196H10.8604V2.86045H9.27905Z" fill="black" fill-opacity="0.3"/></svg>'
const trashIcon = '<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 0C4.75736 0 3.75 1.00736 3.75 2.25V3H2.25H0.75C0.335786 3 0 3.33579 0 3.75C0 4.16421 0.335786 4.5 0.75 4.5H1.5V12C1.5 13.6569 2.84315 15 4.5 15H9C10.6569 15 12 13.6569 12 12V4.5H12.75C13.1642 4.5 13.5 4.16421 13.5 3.75C13.5 3.33579 13.1642 3 12.75 3H11.25H9.75V2.25C9.75 1.00736 8.74264 0 7.5 0H6ZM8.25 3V2.25C8.25 1.83579 7.91421 1.5 7.5 1.5H6C5.58579 1.5 5.25 1.83579 5.25 2.25V3H6.75H8.25ZM4.5 4.5H3V12C3 12.8284 3.67157 13.5 4.5 13.5H9C9.82843 13.5 10.5 12.8284 10.5 12V4.5H9H6.75H4.5ZM5.25 6C5.66421 6 6 6.33579 6 6.75V11.25C6 11.6642 5.66421 12 5.25 12C4.83579 12 4.5 11.6642 4.5 11.25V6.75C4.5 6.33579 4.83579 6 5.25 6ZM8.25 6C8.66421 6 9 6.33579 9 6.75V11.25C9 11.6642 8.66421 12 8.25 12C7.83579 12 7.5 11.6642 7.5 11.25V6.75C7.5 6.33579 7.83579 6 8.25 6Z" fill="black" fill-opacity="0.3"/></svg>';



@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

    accountName: string = "";
    listOfPages: any = [];
    currentUser: any = [];
    listpages: any = [];
    connectedAccounts: any = [];
    user: any = [];
    validateForm!: FormGroup;
    isLoading: boolean = true;
    userRoles: Array<string> = [];
    isCompanyAdmin: boolean = false;

    constructor(
        private iconService: NzIconService,
        private service: FacebookSocialService,
        private accountsService: AccountsService,
        private sharedModule: SharedModule,
        private formBuilder: FormBuilder,
        private modal: NzModalService,
        private router: Router
    ) {
        this.iconService.addIconLiteral('ng-zorro:add', addIcon);
        this.iconService.addIconLiteral('ng-zorro:exclamation', exclamationIcon);
        this.iconService.addIconLiteral('ng-zorro:logout', logoutIcon);
        this.iconService.addIconLiteral('ng-zorro:trash', trashIcon);
    }

    ngOnInit(): void {
        this.validateForm = this.formBuilder.group({
            myChoices: new FormArray([]),
        });
        this.getConnectedAccounts();
        this.getPages();
        if (this.router.url.includes('accounts')) {
            this.sharedModule.initSideMenu('accounts');
        }
        this.userRoles = this.sharedModule.getuserRoles();
        this.userRoles.includes('companyadmin') ? this.isCompanyAdmin = true : this.isCompanyAdmin = false;
    }

    getPages() {
        this.service.getCurrentApprovedFBPages().subscribe(
            (success: any) => {
                this.listOfPages = success.pages;
            },
            (error) => {
                this.listOfPages = [];
            }
        );
    }

    loginWithFacebook(param: string = '') {
        this.service.loginWithFacebook().then((res: LoginResponse) => {
            this.currentUser = res;
            this.user = {
                ...this.user,
                accessToken: res.authResponse.accessToken,
                id: res.authResponse.userID,
            };
            this.service.manageFacebookPages(sharedConstants.API_ENDPOINT + 'get-meta-pages-groups', {
                accessToken: this.user.accessToken,
                id: this.user.id,
            }).subscribe((response: any) => {
                this.accountName = response.accountName;
                this.listpages = response.pages;
                if (param != 'add') {
                    this.getConnectedAccounts();
                }
                this.showModal();
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
            .catch(() => console.error('error'))
            .finally(() => {
            });
    }

    getConnectedAccounts() {
        this.isLoading = true;
        setTimeout(() => {
            this.accountsService.getConnectedAccounts().subscribe({
                next: (response: any) => {
                    this.connectedAccounts = response.accounts;
                },
                error: (err) => {
                    this.connectedAccounts = [];
                    this.isLoading = false;
                },
                complete: () => {
                    this.isLoading = false;
                }
            })
        }, 2000);
    }

    showModal(): void {
        let modal = document.querySelector('.m-modal-pages');
        modal?.classList.add('open');
    }

    closeModal() {
        let modal = document.querySelector('.m-modal-pages');
        modal?.classList.remove('open');
    }

    openSuccessModal() {
        let modal = document.querySelector('.m-success-modal');
        modal?.classList.add('open');
    }

    closeSuccessModal() {
        let modal = document.querySelector('.m-success-modal');
        modal?.classList.remove('open');
    }

    onCheckChange(event: any) {
        const formArray: FormArray = this.validateForm.get(
            'myChoices'
        ) as FormArray;
        if (event.target.checked) {
            formArray.push(new FormControl(event.target.value));
        }
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
                    this.getPages();
                });

            this.validateForm = this.formBuilder.group({
                myChoices: new FormArray([]),
            });
            this.closeModal();
            this.openSuccessModal();
        } else {
            Object.values(this.validateForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    preventMessage(msg: any) {
        if (msg) {
            this.sharedModule.createMessage('error', msg);
        }
    }

    disconnectPage(id: any) {
        this.accountsService.disconnectPageById(id).subscribe({
            next: (event: any) => {

            },
            error: err => {

            },
            complete: () => {
                this.getPages();
            }
        })
    }

    showDisconnectConfirm(id: any): void {
        this.modal.confirm({
            nzTitle: '<b>Do you really want to disconnect from this page?</b>',
            nzContent: '<span style="color: red;">You will have to connect this acocunt via facebook to reconnect</span>',
            nzOkText: 'Disconnect',
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.disconnectPage(id),
            nzCancelText: 'Cancel',
            nzOnCancel: () => { }
        });
    }

    showDeleteConfirm(id: any): void {
        const title = $localize`Do you really want to delete this account?`;
        const deleteButtonText = $localize`Delete`;
        const cancelButtonText = $localize`Cancel`;
        this.modal.confirm({
            nzTitle: title,
            nzOkText: deleteButtonText,
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.deletePage(id),
            nzCancelText: cancelButtonText,
            nzOnCancel: () => console.log('Cancel')
        });
    }

    showDeleteAccountConfirm(id: any): void {
        const title = $localize`Do you really want to delete this personnel account?`;
        const content = $localize`this account will be deleted permenantly`;
        const yesButtonText = $localize`Yes`;
        const noButtonText = $localize`No`;
        this.modal.confirm({
            nzTitle: title,
            nzContent: `<b style="color: red;">${content}</b>`,
            nzOkText: yesButtonText,
            nzOkType: 'primary',
            nzOkDanger: true,
            nzOnOk: () => this.deleteAccount(id),
            nzCancelText: noButtonText,
            nzOnCancel: () => console.log('Cancel')
        });
    }

    reconnectPage(event: any, id: any) {
        this.accountsService.reconnectPageById(id).subscribe({
            next: (event: any) => {

            },
            error: err => {

            },
            complete: () => {
                this.getPages();
            }
        })
    }

    deletePage(id: string) {
        this.isLoading = true;
        this.listOfPages = [];
        this.accountsService.deletePage(id).subscribe({
            next: (event: any) => {

            },
            error: err => {

            },
            complete: () => {
                this.isLoading = false;
                this.getPages();
            }
        })
    }

    deleteAccount(id: string) {
        this.isLoading = true;
        this.listOfPages = [];
        this.connectedAccounts = [];
        this.accountsService.deleteAccount(id).subscribe({
            next: (event: any) => {

            },
            error: err => {

            },
            complete: () => {
                this.isLoading = false;
                this.getConnectedAccounts();
                this.getPages();
            }
        })
    }
}
