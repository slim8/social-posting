import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NzIconService } from 'ng-zorro-antd/icon';
import { LoginResponse } from 'ngx-facebook';
import { SharedModule } from 'src/app/shared/shared.module';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { FacebookSocialService } from '../facebook-social/services/facebook-social.service';
import { AccountsService } from '../social-accounts/services/accounts.service';

const addIcon = '<svg width="64" height="67" viewBox="0 0 64 67" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.874837 59.8333C0.874837 61.6513 2.34857 63.125 4.1665 63.125C5.98444 63.125 7.45817 61.6513 7.45817 59.8333H0.874837ZM32.9686 43.375C34.7865 43.375 36.2603 41.9013 36.2603 40.0833C36.2603 38.2654 34.7865 36.7917 32.9686 36.7917V43.375ZM52.0126 39.9664C52.0126 38.1485 50.5389 36.6747 48.7209 36.6747C46.903 36.6747 45.4293 38.1485 45.4293 39.9664H52.0126ZM45.4293 63.242C45.4293 65.0599 46.903 66.5337 48.7209 66.5337C50.5389 66.5337 52.0126 65.0599 52.0126 63.242H45.4293ZM60.3587 54.8959C62.1767 54.8959 63.6504 53.4221 63.6504 51.6042C63.6504 49.7863 62.1767 48.3125 60.3587 48.3125V54.8959ZM37.0831 48.3125C35.2652 48.3125 33.7915 49.7863 33.7915 51.6042C33.7915 53.4221 35.2652 54.8959 37.0831 54.8959V48.3125ZM7.45817 59.8333V56.5417H0.874837V59.8333H7.45817ZM37.0832 17.0417C37.0832 22.4955 32.662 26.9167 27.2082 26.9167V33.5C36.2979 33.5 43.6665 26.1314 43.6665 17.0417H37.0832ZM27.2082 26.9167C21.7544 26.9167 17.3332 22.4955 17.3332 17.0417H10.7498C10.7498 26.1314 18.1185 33.5 27.2082 33.5V26.9167ZM17.3332 17.0417C17.3332 11.5879 21.7544 7.16667 27.2082 7.16667V0.583333C18.1185 0.583333 10.7498 7.95198 10.7498 17.0417H17.3332ZM27.2082 7.16667C32.662 7.16667 37.0832 11.5879 37.0832 17.0417H43.6665C43.6665 7.95198 36.2979 0.583333 27.2082 0.583333V7.16667ZM45.4293 39.9664V51.6042H52.0126V39.9664H45.4293ZM45.4293 51.6042V63.242H52.0126V51.6042H45.4293ZM48.7209 54.8959H60.3587V48.3125H48.7209V54.8959ZM48.7209 48.3125H37.0831V54.8959H48.7209V48.3125ZM7.45817 56.5417C7.45817 49.2699 13.3531 43.375 20.6248 43.375V36.7917C9.71721 36.7917 0.874837 45.634 0.874837 56.5417H7.45817ZM20.6248 43.375H32.9686V36.7917H20.6248V43.375Z" fill="#E2E2E2"/></svg>';
const openIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.60714 3C5.02136 3 5.35714 2.66421 5.35714 2.25C5.35714 1.83579 5.02136 1.5 4.60714 1.5V3ZM10.5 6.91071C10.5 6.4965 10.1642 6.16071 9.75 6.16071C9.33579 6.16071 9 6.4965 9 6.91071H10.5ZM11.25 0.75H12C12 0.335786 11.6642 0 11.25 0V0.75ZM8.25 0C7.83579 0 7.5 0.335786 7.5 0.75C7.5 1.16421 7.83579 1.5 8.25 1.5V0ZM10.5 3.75C10.5 4.16421 10.8358 4.5 11.25 4.5C11.6642 4.5 12 4.16421 12 3.75H10.5ZM3.21967 7.71967C2.92678 8.01256 2.92678 8.48744 3.21967 8.78033C3.51256 9.07322 3.98744 9.07322 4.28033 8.78033L3.21967 7.71967ZM8.25 10.5H2.25V12H8.25V10.5ZM1.5 9.75V3.75H0V9.75H1.5ZM2.25 3H4.60714V1.5H2.25V3ZM9 6.91071V9.75H10.5V6.91071H9ZM2.25 10.5C1.83579 10.5 1.5 10.1642 1.5 9.75H0C0 10.9926 1.00736 12 2.25 12V10.5ZM8.25 12C9.49264 12 10.5 10.9926 10.5 9.75H9C9 10.1642 8.66421 10.5 8.25 10.5V12ZM1.5 3.75C1.5 3.33579 1.83579 3 2.25 3V1.5C1.00736 1.5 0 2.50736 0 3.75H1.5ZM11.25 0H8.25V1.5H11.25V0ZM10.5 0.75V3.75H12V0.75H10.5ZM4.28033 8.78033L11.7803 1.28033L10.7197 0.21967L3.21967 7.71967L4.28033 8.78033Z" fill="black"/></svg>';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    isVisible: boolean = true;
    isLoadingPages: boolean = true;
    isLoadingPosts: boolean = true;
    validateForm!: FormGroup;
    connectedAccounts: any = [];
    posts: any = [];
    listOfPages: any = [];
    user = {
        accessToken: '',
        id: '',
        pages: [],
    };
    currentUser: any;
    listpages: any;

    constructor(
        private iconService: NzIconService,
        private service: FacebookSocialService,
        private accountsService: AccountsService,
        private sharedModule: SharedModule,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.iconService.addIconLiteral('ng-zorro:add', addIcon);
        this.iconService.addIconLiteral('ng-zorro:open', openIcon);
    }

    ngOnInit(): void {
        if (this.router.url.includes('dashboard')) {
            this.sharedModule.initSideMenu('dashboard');
        }
        this.validateForm = this.formBuilder.group({
            myChoices: new FormArray([]),
        });
        let closeButton = document.querySelector('.m-close-icon');

        closeButton?.addEventListener('click', this.closeAlert);
        this.getPages();
        this.getRecentPosts();
        setTimeout(() => {
            this.disableButtons();
        }, 50)

    }

    closeAlert(event: any) {
        let message = event.target.parentElement?.parentElement?.parentElement;
        message.classList.add('is-closed');
        setTimeout(() => {
            message.remove();
        }, 295)
    }

    loginWithFacebook() {
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
                this.listpages = response.pages;
                this.getConnectedAccounts();
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
        this.isLoadingPages = true;

        setTimeout(() => {
            this.accountsService.getConnectedAccounts().subscribe({
                next: (response: any) => {
                    this.connectedAccounts = response.accounts;
                },
                error: (err) => {
                    this.connectedAccounts = [];
                    this.isLoadingPages = false;
                },
                complete: () => {
                    this.isLoadingPages = false;
                }
            })
        }, 2000);

    }

    getPages() {
        this.service.getCurrentApprovedFBPages().subscribe(
            (success: any) => {
                this.listOfPages = success.pages;
                setTimeout(() => {
                    this.disableButtons();
                }, 50)
                this.isLoadingPages = false;
            },
            (error) => {
                this.listOfPages = [];
                this.isLoadingPages = false;
            }
        );
    }

    getRecentPosts() {
        const params = new HttpParams()
            .set("filterBy", "AccountsPosts")
            .set("limit", "4")
            .set("status", "PUBLISH")
            .set("getStat", true);
        this.accountsService.getRecentPosts(params).subscribe({
            next: (event: any) => {
                console.log(event)
                this.posts = event.posts;
                this.isLoadingPosts = false;
            },
            error: (err) => {
                this.isLoadingPosts = false;
            },
            complete: () => {
                this.isLoadingPosts = false;
            }
        })
    }

    showModal(): void {
        let modal = document.querySelector('.m-modal-pages');
        modal?.classList.add('open');
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

    onCheckChange(event: any) {
        const formArray: FormArray = this.validateForm.get(
            'myChoices'
        ) as FormArray;
        if (event.target.checked) {
            formArray.push(new FormControl(event.target.value));
        }
    }

    preventMessage(msg: any) {
        if (msg) {
            this.sharedModule.createMessage('error', msg);
        }
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

    disableButtons() {
        let disabledButtons = document.querySelectorAll('.is-disabled');
        let activeButtons = document.querySelectorAll('.is-primary');
        disabledButtons?.forEach((button: any) => {
            button.setAttribute('disabled', true);
        })
        activeButtons?.forEach((button: any) => {
            button.removeAttribute('disabled');
        })
    }
}
