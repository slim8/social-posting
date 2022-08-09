import { HttpParams } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AccountsManagementAnimations } from 'src/app/shared/animations/accounts-management-animations';

const calendarIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5V5.25C15 4.42157 14.3284 3.75 13.5 3.75H4.5C3.67157 3.75 3 4.42157 3 5.25V7.5M15 7.5V14.25C15 15.0784 14.3284 15.75 13.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V7.5M15 7.5H3M6 2.25V5.25M12 2.25V5.25" stroke="black" stroke - width="1.5" stroke - linecap="round"/><rect x="4.5" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="7.875" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="11.25" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/></svg>'
const arrowIcon = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.08398 1.24992L5.41313 4.92077C5.18532 5.14858 4.81598 5.14858 4.58817 4.92077L0.917318 1.24992" stroke="black" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const externalLinkIcon = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.60714 3C5.02136 3 5.35714 2.66421 5.35714 2.25C5.35714 1.83579 5.02136 1.5 4.60714 1.5V3ZM10.5 6.91071C10.5 6.4965 10.1642 6.16071 9.75 6.16071C9.33579 6.16071 9 6.4965 9 6.91071H10.5ZM11.25 0.75H12C12 0.335786 11.6642 0 11.25 0V0.75ZM8.25 0C7.83579 0 7.5 0.335786 7.5 0.75C7.5 1.16421 7.83579 1.5 8.25 1.5V0ZM10.5 3.75C10.5 4.16421 10.8358 4.5 11.25 4.5C11.6642 4.5 12 4.16421 12 3.75H10.5ZM3.21967 7.71967C2.92678 8.01256 2.92678 8.48744 3.21967 8.78033C3.51256 9.07322 3.98744 9.07322 4.28033 8.78033L3.21967 7.71967ZM8.25 10.5H2.25V12H8.25V10.5ZM1.5 9.75V3.75H0V9.75H1.5ZM2.25 3H4.60714V1.5H2.25V3ZM9 6.91071V9.75H10.5V6.91071H9ZM2.25 10.5C1.83579 10.5 1.5 10.1642 1.5 9.75H0C0 10.9926 1.00736 12 2.25 12V10.5ZM8.25 12C9.49264 12 10.5 10.9926 10.5 9.75H9C9 10.1642 8.66421 10.5 8.25 10.5V12ZM1.5 3.75C1.5 3.33579 1.83579 3 2.25 3V1.5C1.00736 1.5 0 2.50736 0 3.75H1.5ZM11.25 0H8.25V1.5H11.25V0ZM10.5 0.75V3.75H12V0.75H10.5ZM4.28033 8.78033L11.7803 1.28033L10.7197 0.21967L3.21967 7.71967L4.28033 8.78033Z" fill="black"/></svg>';
import $ from 'jquery';
import { PostService } from '../social-accounts/services/post.service';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
    selector: 'app-published-posts',
    templateUrl: './published-posts.component.html',
    styleUrls: ['./published-posts.component.scss'],
    animations: [AccountsManagementAnimations]
})
export class PublishedPostsComponent implements OnInit {
    isLoading = false;
    posts: any = [];
    constructor(private iconService: NzIconService, private postService: PostService, private router: Router, private sharedModule: SharedModule) {
        this.iconService.addIconLiteral('ng-zorro:customCalendar', calendarIcon);
        this.iconService.addIconLiteral('ng-zorro:customArrow', arrowIcon);
        this.iconService.addIconLiteral('ng-zorro:external-link', externalLinkIcon);
        if (this.router.url.includes('published-posts')) {
          this.sharedModule.initSideMenu('published-posts');
        }
    }


    ngOnInit(): void {
        this.getPosts();
    }


    getPosts(pageNumber = 1) {
        this.isLoading = true;
        const params = new HttpParams()
            .set("filterBy", "AccountsPosts")
            .set("limit", "10")
            .set("status", "PUBLISH")
            .set("getStat", true);
        this.postService.getPosts(params).subscribe({
            next: (event: any) => {
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

    collapse(event: any) {
        const element = $(event.target);
        element.toggleClass('is-active');
        element.parent().parent().find('.m-details').toggleClass('is-active');
    }

}
