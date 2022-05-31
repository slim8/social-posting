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
        console.log(this.userInfo);
    }

    collapse() {
        this.isCollapsed = !this.isCollapsed
        this.newCollapseEvent.emit(this.isCollapsed);
    }

    menuCollapse(event: any) {
        let menu = document.getElementById("loggedMenu") as HTMLElement
        menu.classList.toggle("is-open")
    }

}
