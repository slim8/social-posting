import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})

export class UsersListComponent implements OnInit {

  listOfUsers : any = [];

  constructor( private router: Router ,  private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getUsersList().subscribe({
      next: (event: any) => {
          console.log(event);
          this.listOfUsers = event.users;
        },
      error: err => {
        
      },
      complete: () => {
      }
    })
  }

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  navigateToCreateUser(){
    this.router.navigate(['/home/management/create-user']);
  }


}
