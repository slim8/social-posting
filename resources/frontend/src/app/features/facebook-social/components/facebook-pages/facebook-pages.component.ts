import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacebookSocialService } from '../../services/facebook-social.service';
import { SharedModule } from '../../../../shared/shared.module';
import {Router} from "@angular/router";

@Component({
    selector: 'app-facebook-pages',
    templateUrl: './facebook-pages.component.html',
    styleUrls: ['./facebook-pages.component.scss']
})

export class FacebookPagesComponent implements OnInit {

    constructor(private shared: SharedModule,
                private facebookSocialService: FacebookSocialService,
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
            },
            error: err => {
                this.shared.createMessage('error', err.error.errors);
            },
            complete: () => {
                this.container.forEach((page : any) => {
                    if(page.provider == 'facebook') {
                        this.facebookPages.push(page)
                    } else if(page.provider == 'instagram') {
                        this.instaPages.push(page)
                    }
                })
                this.instaPageCount = this.instaPages.length
                this.fbPageCount = this.facebookPages.length
                this.pages = this.container
            }
        })
    }

  getPostsBypageId(pageId:any) {
    this.router.navigateByUrl("/home/facebook/accounts-posts/"+btoa(pageId));
  }
}
