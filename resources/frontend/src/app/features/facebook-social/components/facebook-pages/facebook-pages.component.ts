import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacebookSocialService } from '../../services/facebook-social.service';
import { SharedModule } from '../../../../shared/shared.module';

interface Page {
    id: Number;
    pageName: String;
    pagePictureUrl: String;
    category: String;
    pageId: Number;
}

@Component({
    selector: 'app-facebook-pages',
    templateUrl: './facebook-pages.component.html',
    styleUrls: ['./facebook-pages.component.scss']
})

export class FacebookPagesComponent implements OnInit {

    constructor(private shared: SharedModule, private facebookSocialService: FacebookSocialService, private messageService: NzMessageService) { }

    pages: any[] = [];
    container = [];

    ngOnInit(): void {
        this.getPages();
    }

    getPages() {
        this.facebookSocialService.getCurrentApprovedFBPages().subscribe({
            next: (event: any) => {
                this.container = event.pages;
                console.log('loading');
            },
            error: err => {
                this.shared.createMessage('error', err.error.errors);
            },
            complete: () => {
                console.log('complete');
                this.pages = this.container
            }
        })
    }
}
