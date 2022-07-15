import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacebookSocialService } from 'src/app/features/facebook-social/services/facebook-social.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountsService } from '../../services/accounts.service';

@Component({
    selector: 'app-account-pages',
    templateUrl: './account-pages.component.html',
    styleUrls: ['./account-pages.component.scss']
})
export class AccountPagesComponent implements OnInit {

    constructor(private shared: SharedModule,
        private facebookSocialService: FacebookSocialService,
        private accountService: AccountsService,
        private messageService: NzMessageService,
        private router: Router) { }

    pages: any[] = [];
    fbPageCount = 0
    instaPageCount = 0
    instaPages: any[] = [];
    facebookPages: any[] = [];
    container = [];
    loading = true;

    ngOnInit(): void {
        this.getPages();
    }

    getPages() {
        this.facebookSocialService.getCurrentApprovedFBPages().subscribe({
            next: (event: any) => {
                this.container = event.pages;
                console.log(event);
            },
            error: err => {
                this.shared.createMessage('error', err.error.errors);
            },
            complete: () => {
                this.facebookPages = [];
                this.instaPages = [];
                this.container.forEach((page: any) => {
                    if (page.provider == 'facebook') {
                        this.facebookPages.push(page)
                    } else if (page.provider == 'instagram') {
                        this.instaPages.push(page)
                    }
                })
                this.instaPageCount = this.instaPages.length
                this.fbPageCount = this.facebookPages.length
                this.pages = this.container
            }
        })
        this.instaPageCount = this.instaPages.length
        this.fbPageCount = this.facebookPages.length
        this.pages = this.container
    }

    getPostsBypageId(pageId: any) {
        this.router.navigateByUrl("/home/facebook/accounts-posts/" + btoa(pageId));
    }

    disconnectPage(event: any, id: any) {
        this.accountService.disconnectPageById(id).subscribe({
            next: (event: any) => {

            },
            error: err => {

            },
            complete: () => {
                this.getPages();
            }
        })
    }

    reconnectPage(event: any, id: any) {
        this.accountService.reconnectPageById(id).subscribe({
            next: (event: any) => {

            },
            error: err => {

            },
            complete: () => {
                this.getPages();
            }
        })
    }
}
