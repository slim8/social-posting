import { ProfileService } from './../../../features/user/services/profile.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Router, Event, NavigationEnd} from '@angular/router';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    userInfo: any = '';
    @Input() isCollapsed: boolean | undefined;
    @Output() newCollapseEvent = new EventEmitter<boolean>();

    constructor( private profileService: ProfileService , private jwtService: JwtHelperService , private router: Router) {

        this.router.events.subscribe((event: Event) => {
    
            if (event instanceof NavigationEnd) {
                this.getProfileDetails();
            }

        });
     }

    ngOnInit(): void {
        
    }

    getProfileDetails(){
        this.profileService.getProfileDetails().subscribe({
            next: (event: any) => { 
                this.userInfo = event ; 
            },
            error: err => {
            },
            complete: () => {
            }
        })
    }

    collapse() {
        this.isCollapsed = !this.isCollapsed
        this.newCollapseEvent.emit(this.isCollapsed);
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

}
