import { Component, OnInit } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { AccountsService } from '../social-accounts/services/accounts.service';
import { HttpParams } from '@angular/common/http';

const calendarIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5V5.25C15 4.42157 14.3284 3.75 13.5 3.75H4.5C3.67157 3.75 3 4.42157 3 5.25V7.5M15 7.5V14.25C15 15.0784 14.3284 15.75 13.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V7.5M15 7.5H3M6 2.25V5.25M12 2.25V5.25" stroke="black" stroke - width="1.5" stroke - linecap="round"/><rect x="4.5" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="7.875" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="11.25" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/></svg>'
const arrowIcon = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.08398 1.24992L5.41313 4.92077C5.18532 5.14858 4.81598 5.14858 4.58817 4.92077L0.917318 1.24992" stroke="black" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>'

@Component({
    selector: 'app-drafts',
    templateUrl: './drafts.component.html',
    styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit {
    posts: any[] = [];
    draftsList: any = [];

    constructor(private iconService: NzIconService, private accountsService: AccountsService) {
        this.iconService.addIconLiteral('ng-zorro:customCalendar', calendarIcon);
        this.iconService.addIconLiteral('ng-zorro:customArrow', arrowIcon);
    }


    ngOnInit(): void {
        this.getDrafts();
    }

    update(event: any) {
        this.draftsList = event;
    }


    getDrafts() {
        const params = new HttpParams()
            .set("filterBy", "AccountsPosts")
            .set("limit", "10")
            .set("status", "DRAFT")
            .set("getStat", false);

        this.accountsService.getPosts(params).subscribe({
            next: (event: any) => {
                this.posts = event.posts;
            },
            error: (err) => {
                this.posts = []
            },
            complete: () => {
            }
        })
    }

    removeDraft() {
        if (this.draftsList.length > 0) {

            const formData: FormData = new FormData();
            this.draftsList.forEach((draft: any) => {
                formData.append('postsIds[]', draft);
            })
            confirm('Are you sure you want to delete this item?');
            this.accountsService.removeDrafts(formData).subscribe({
                next: (event: any) => {
                },
                error: (err) => {
                },
                complete: () => {
                    this.getDrafts();
                }
            })
        } else {
            alert('vide');
        }

    }

}
