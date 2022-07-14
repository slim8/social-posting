import { HttpParams } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AccountsManagementAnimations } from 'src/app/shared/animations/accounts-management-animations';
import { AccountsService } from '../social-accounts/services/accounts.service';

const calendarIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5V5.25C15 4.42157 14.3284 3.75 13.5 3.75H4.5C3.67157 3.75 3 4.42157 3 5.25V7.5M15 7.5V14.25C15 15.0784 14.3284 15.75 13.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V7.5M15 7.5H3M6 2.25V5.25M12 2.25V5.25" stroke="black" stroke - width="1.5" stroke - linecap="round"/><rect x="4.5" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="7.875" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="11.25" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/></svg>'
const arrowIcon = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.08398 1.24992L5.41313 4.92077C5.18532 5.14858 4.81598 5.14858 4.58817 4.92077L0.917318 1.24992" stroke="black" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>'
@Component({
    selector: 'app-published-posts',
    templateUrl: './published-posts.component.html',
    styleUrls: ['./published-posts.component.scss'],
    animations: [AccountsManagementAnimations]
})
export class PublishedPostsComponent implements OnInit {
    isLoading = false;
    posts: any = [];
    constructor(private iconService: NzIconService, private accountsService: AccountsService) {
        this.iconService.addIconLiteral('ng-zorro:customCalendar', calendarIcon);
        this.iconService.addIconLiteral('ng-zorro:customArrow', arrowIcon);
    }


    ngOnInit(): void {
        // this.isLoading = true;
        // setTimeout(() => {
        //     this.isLoading = false;
        // }, 2000)
        this.getPosts();
    }


    getPosts(pageNumber = 1) {
        this.isLoading = true;
        const params = new HttpParams()
            .set("filterBy", "AccountsPosts")
            .set("limit", "10")
            .set("status", "PUBLISH")
            .set("getStat", true);
        this.accountsService.getPosts(params).subscribe({
            next: (event: any) => {
                console.log(event)
                this.posts = event.posts;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            }
        })
    }

}
