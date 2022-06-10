import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    userInfo :any ='';
    @Input() isCollapsed: boolean | undefined;
    @Output() newCollapseEvent = new EventEmitter<boolean>();

    constructor(private jwtService: JwtHelperService) { }

    ngOnInit(): void {
        this.userInfo = this.jwtService.decodeToken();
        document.addEventListener("click", this.resetMenu);
    }

    collapse() {
        this.isCollapsed = !this.isCollapsed
        this.newCollapseEvent.emit(this.isCollapsed);
    }

    menuCollapse(event: any) {
        let menu = document.getElementById("loggedMenu") as HTMLElement
        menu.classList.toggle("is-open")
    }

    resetMenu(e:any)  {
        let menuBtn = document.getElementById("loggedin") as HTMLElement
        let menu = document.getElementById("loggedMenu") as HTMLElement
        if(!e.path?.includes(menuBtn) && !e.path?.includes(menu)) {
            menu.classList.remove("is-open")
        }
    }

}
