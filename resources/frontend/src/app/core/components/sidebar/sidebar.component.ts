import { JwtHelperService } from '@auth0/angular-jwt';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input () isCollapsed: boolean | undefined;
  roles : any = null ;

  constructor(private jwtService: JwtHelperService ) { }

  ngOnInit(): void {
    this.roles = this.jwtService.decodeToken().data.roles;
  }

  checkRole(role: any): void {
    return this.roles.includes(role);
  }

}
