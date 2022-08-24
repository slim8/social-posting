import { NzModalService } from 'ng-zorro-antd/modal';
import { Data, Router } from '@angular/router';
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
  listOfPages : any = [];
  isModalVisible:boolean = false;
  checked = false;
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  setOfCheckedPageId = new Set<number>();
  pageName = "";
  accountId = "";
  userId = "";
  modalMessage = "";
  modalSubMessage = "";
  type = "";
  isVisible = false;
  isOkLoading = false;
  isUsersLoading = false;

  constructor( private router: Router ,  private userService: UserService , private modal: NzModalService) { }

  ngOnInit(): void {
    this.isUsersLoading = true;
    this.getData();
  }

  expandSet = new Set<number>();

  getData(){
    this.userService.getUsersList().subscribe({
      next: (event: any) => {
          this.listOfUsers = event.users;
        },
      error: err => {

      },
      complete: () => {
      }
    })

    this.userService.getPagesList().subscribe({
      next: (event: any) => {
          this.listOfPages = event.pages;
        },
      error: err => {

      },
      complete: () => {
        this.isUsersLoading = false;
      }
    })
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onAllChecked(checked: boolean): void {
    this.listOfUsers
      .forEach((user : any ) => this.updateCheckedSet(user.id, checked));
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfUsers.every(( { id } :any ) => this.setOfCheckedId.has(id));
    this.indeterminate = this.listOfUsers.some(({ id } :any) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  sendRequest(): void {
    this.loading = true;
    const requestData = this.listOfUsers.filter((data : any) => this.setOfCheckedId.has(data.id));
    setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.loading = false;
    }, 1000);
  }

  navigateToCreateUser(){
    this.router.navigate(['/application/management/create-user']);
  }

  showModal(): void {
    this.isVisible = true;
    this.setOfCheckedPageId = new Set<number>();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onItemCheckedPage(id: number, checked: boolean): void {
    this.updateCheckedPageSet(id, checked);

  }

  updateCheckedPageSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedPageId.add(id);
    } else {
      this.setOfCheckedPageId.delete(id);
    }
  }

  addPermission(): void {
    this.isOkLoading = true;

    const formData: FormData = new FormData();

    this.setOfCheckedPageId.forEach((accountId: any) => {
        formData.append('accounts[]', accountId);
    });

    this.setOfCheckedId.forEach((userId: any) => {
      formData.append('users[]', userId);
    });

    this.userService.addPermission(formData).subscribe({
      next: (event: any) => {
          this.isVisible = false;
          this.getData();
        },
      error: err => {
        this.isOkLoading = false;
      },
      complete: () => {
        this.isOkLoading = false;
      }
    })

  }

  showDeleteModal(type: string, userId : any ,accountId : any = 0 , e : Event){
    e.preventDefault();
    this.isModalVisible = true;
    this.type = type;
    this.userId = userId;
    if(type=="permission") {
      this.pageName = this.getPermissionName(accountId);
      this.accountId = accountId;
      this.modalMessage = "Do you Want to remove this permission ?";
      this.modalSubMessage = "Remove permissions "+ this.pageName;
    } else {
      this.modalMessage = "Do you Want to delete this user ?";
      this.modalSubMessage = "";
    }
  }

  remove() {
    if(this.type=="permission") {
      const formData: FormData = new FormData();
      formData.append('accounts[]', this.accountId);
      formData.append('users[]', this.userId);
      this.userService.removePermission(formData).subscribe({
        next: (event: any) => {
            this.getData();
          },
        error: err => {
        },
        complete: () => {
          this.accountId = "";
          this.userId = "";
          this.isModalVisible = false;
        }
      })
    }else {
      this.userService.deleteUser(this.userId).subscribe({
        next: (event:any) => {

        },
        error: err => {
        },
        complete: () => {
          this.accountId = "";
          this.userId = "";
          this.isModalVisible = false;
          this.getData();
        }
      })
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.pageName = "";
    this.accountId = "";
    this.userId = "";
  }

  getPermissionName(tag : any){
    return (this.listOfPages.filter((page : any) => page.id === tag)[0]).pageName ;
  }

  getPermissionPagePicture(tag : any){
    return (this.listOfPages.filter((page : any) => page.id === tag)[0]).pagePictureUrl;
  }

  getPermissionProvider(tag : any){
    return (this.listOfPages.filter((page : any) => page.id === tag)[0]).provider ;
  }

  editUser(id: string) {
    this.router.navigate(['/application/management/edit-user' , id]);
  }
}
