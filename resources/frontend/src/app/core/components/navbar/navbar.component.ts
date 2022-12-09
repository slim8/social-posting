import { ProfileService } from './../../../features/user/services/profile.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, Event, NavigationEnd } from '@angular/router';
import { NzIconService } from 'ng-zorro-antd/icon';

const homeIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.77778 7.22222V15C2.77778 16.1046 3.67321 17 4.77778 17H9M2.77778 7.22222L8.29289 1.70711C8.68342 1.31658 9.31658 1.31658 9.70711 1.70711L14.5 6.5M2.77778 7.22222L1 9M15.2222 7.22222V15C15.2222 16.1046 14.3268 17 13.2222 17H9M15.2222 7.22222L17 9M15.2222 7.22222L14.5 6.5M14.5 6.5V3M9 17V12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    userInfo: any = '';
    @Output() newCollapseEvent = new EventEmitter<boolean>();

    constructor(private profileService: ProfileService, private jwtService: JwtHelperService, private router: Router, private iconService: NzIconService) {
        this.iconService.addIconLiteral('ng-zorro:home', homeIcon);
        this.router.events.subscribe((event: Event) => {

            if (event instanceof NavigationEnd) {
                this.getProfileDetails();
            }

        });
    }

    ngOnInit(): void {
    }

    getProfileDetails() {
        this.profileService.getProfileDetails().subscribe({
            next: (event: any) => {
                this.userInfo = event;
            },
            error: err => {
            },
            complete: () => {
            }
        })
    }

    menuCollapse(event: any) {
        let menu = document.getElementById("loggedMenu") as HTMLElement
        menu.classList.toggle("is-open")
    }

    resetMenu(e: any) {
        let menu = document.getElementById("loggedMenu") as HTMLElement
        if (!e.target.classList.contains("user-menu-toggle")) {
            menu.classList.remove("is-open")
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        this.router.navigate(['/auth/login']);
    }

}
