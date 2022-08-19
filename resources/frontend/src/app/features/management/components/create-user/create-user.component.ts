import { UserService } from './../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import { FacebookSocialService } from 'src/app/features/facebook-social/services/facebook-social.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private facebookSocialService: FacebookSocialService,
    private shared: SharedModule
  ) {}

  email = null;
  firstName = null;
  lastName = null;
  isSubscriber = false;
  address = null;
  city = null;
  postCode = null;
  website = null;
  error: any = null;
  newPassword = Math.random().toString(36).slice(-8);
  accountsValue: any[] = [];
  size: NzSelectSizeType = 'large';
  listOfPages: Array<{
    id: number;
    pageName: string;
    provider: string;
    pagePictureUrl: string;
  }> = [];
  pageId: string = '';

  showNewPassword: Boolean = false;

  ngOnInit(): void {
    this.getPages('mixed');
  }

  showNewPasswordAction() {
    this.showNewPassword = !this.showNewPassword;
  }

  saveProfile() {
    this.error = null;
    let data = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      isSubscriber: this.isSubscriber,
      address: this.address,
      city: this.city,
      postCode: this.postCode,
      password: this.newPassword,
      accounts: this.accountsValue
    };

    this.userService.createUser(data).subscribe({
      next: (event: any) => {
        this.router.navigate(['/application/management/users-list']);
      },
      error: (err) => {
        this.error = err.error;
      },
      complete: () => {},
    });
  }

  accountChange() {
  }

  getPages(param: string, fromInit = false) {
    this.listOfPages = [];
    this.accountsValue = [];
    this.facebookSocialService.getCurrentApprovedFBPages().subscribe({
      next: (event: any) => {
        this.listOfPages = new Array();
        event.pages.forEach((page: any) => {
          if (param == 'mixed') {
            if (page.isConnected == true) {
              this.listOfPages.push(page);
            }
            if (this.pageId != '') {
              if (page.id == this.pageId) {
                let selectedPage = page.id + '|' + page.provider;
                this.accountsValue.push(selectedPage);
              }
            }
          } else if (param == 'instagram') {
            if (page.isConnected == true && page.provider == 'instagram') {
              this.listOfPages.push(page);
            }
          }
        });
      },
      error: (err) => {
        this.shared.createMessage('error', err.error.message);
      },
      complete: () => {},
    });
  }
}
