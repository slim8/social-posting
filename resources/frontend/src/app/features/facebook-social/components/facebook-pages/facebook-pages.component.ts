import { Component, OnInit } from '@angular/core';
import { FacebookSocialService } from '../../services/facebook-social.service';

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

    constructor(private facebookSocialService: FacebookSocialService) { }

    pages: any[] = [];

    ngOnInit(): void {
        this.getPages();
    }

    getPages() {
        this.facebookSocialService.getCurrentApprovedFBPages().subscribe(
            (success: any) => {
                console.log(success);
                this.pages = success.pages;
            },
            (error) => {
                // this.createMessage('error', error.error.message);
            }
        );
    }

}
