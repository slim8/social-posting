import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzIconService } from 'ng-zorro-antd/icon';
import { LoginResponse } from 'ngx-facebook';
import { SharedModule } from 'src/app/shared/shared.module';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { FacebookSocialService } from '../facebook-social/services/facebook-social.service';
import { AccountsService } from '../social-accounts/services/accounts.service';

const addIcon = '<svg width="64" height="67" viewBox="0 0 64 67" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.874837 59.8333C0.874837 61.6513 2.34857 63.125 4.1665 63.125C5.98444 63.125 7.45817 61.6513 7.45817 59.8333H0.874837ZM32.9686 43.375C34.7865 43.375 36.2603 41.9013 36.2603 40.0833C36.2603 38.2654 34.7865 36.7917 32.9686 36.7917V43.375ZM52.0126 39.9664C52.0126 38.1485 50.5389 36.6747 48.7209 36.6747C46.903 36.6747 45.4293 38.1485 45.4293 39.9664H52.0126ZM45.4293 63.242C45.4293 65.0599 46.903 66.5337 48.7209 66.5337C50.5389 66.5337 52.0126 65.0599 52.0126 63.242H45.4293ZM60.3587 54.8959C62.1767 54.8959 63.6504 53.4221 63.6504 51.6042C63.6504 49.7863 62.1767 48.3125 60.3587 48.3125V54.8959ZM37.0831 48.3125C35.2652 48.3125 33.7915 49.7863 33.7915 51.6042C33.7915 53.4221 35.2652 54.8959 37.0831 54.8959V48.3125ZM7.45817 59.8333V56.5417H0.874837V59.8333H7.45817ZM37.0832 17.0417C37.0832 22.4955 32.662 26.9167 27.2082 26.9167V33.5C36.2979 33.5 43.6665 26.1314 43.6665 17.0417H37.0832ZM27.2082 26.9167C21.7544 26.9167 17.3332 22.4955 17.3332 17.0417H10.7498C10.7498 26.1314 18.1185 33.5 27.2082 33.5V26.9167ZM17.3332 17.0417C17.3332 11.5879 21.7544 7.16667 27.2082 7.16667V0.583333C18.1185 0.583333 10.7498 7.95198 10.7498 17.0417H17.3332ZM27.2082 7.16667C32.662 7.16667 37.0832 11.5879 37.0832 17.0417H43.6665C43.6665 7.95198 36.2979 0.583333 27.2082 0.583333V7.16667ZM45.4293 39.9664V51.6042H52.0126V39.9664H45.4293ZM45.4293 51.6042V63.242H52.0126V51.6042H45.4293ZM48.7209 54.8959H60.3587V48.3125H48.7209V54.8959ZM48.7209 48.3125H37.0831V54.8959H48.7209V48.3125ZM7.45817 56.5417C7.45817 49.2699 13.3531 43.375 20.6248 43.375V36.7917C9.71721 36.7917 0.874837 45.634 0.874837 56.5417H7.45817ZM20.6248 43.375H32.9686V36.7917H20.6248V43.375Z" fill="#E2E2E2"/></svg>';
const exclamationIcon = '<svg width="24" height="27" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 13.96C13 13.4077 12.5523 12.96 12 12.96C11.4477 12.96 11 13.4077 11 13.96H13ZM11 16.96C11 17.5122 11.4477 17.96 12 17.96C12.5523 17.96 13 17.5122 13 16.96H11ZM11 13.96V16.96H13V13.96H11Z" fill="#FF8D69"/><circle cx="12" cy="11" r="1" fill="#FF8D69"/><path d="M3.83827 18.5097L11.1284 5.54947C11.5107 4.86982 12.4893 4.86982 12.8716 5.54947L20.1617 18.5097C20.5367 19.1763 20.055 20 19.2902 20H4.70985C3.94502 20 3.46331 19.1763 3.83827 18.5097Z" stroke="#FF8D69" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

    listOfPages: any = [];
    currentUser: any = [];
    listpages: any = [];
    connectedAccounts: any = [];
    user: any = [];
    validateForm!: FormGroup;
    isLoading: boolean = true;

    constructor(
        private iconService: NzIconService,
        private service: FacebookSocialService,
        private accountsService: AccountsService,
        private sharedModule: SharedModule,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.iconService.addIconLiteral('ng-zorro:add', addIcon);
        this.iconService.addIconLiteral('ng-zorro:exclamation', exclamationIcon);
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
    }

    getPages() {
        this.service.getCurrentApprovedFBPages().subscribe(
            (success: any) => {
                this.listOfPages = success.pages;
                console.log(this.listOfPages);
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
            this.service.manageFacebookPages(sharedConstants.API_ENDPOINT + '/get-meta-pages-groups', {
                accessToken: this.user.accessToken,
                id: this.user.id,
            }).subscribe((response: any) => {
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
                sharedConstants.API_ENDPOINT + '/save-meta-pages-groups',
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
}
