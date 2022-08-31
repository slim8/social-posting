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
    private shared: SharedModule,
    private route:ActivatedRoute
  ) {}

  isLoading: boolean = false;
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
  listOfPages: Array<{ id: number; pageName: string; provider: string; pagePictureUrl: string }> = [];
  pageId: string = "";
  showNewPassword : Boolean = false ;
  userEditId: string | null = null;
  editMode: boolean = false;

  ngOnInit(): void {
    this.getPages();
    this.userEditId = this.route.snapshot.paramMap.get('id');
    if(this.userEditId) {
      this.editMode = true;
      this.getUserToEdit(this.userEditId);
    }
  }

  getUserToEdit(news : any){
    this.userService.getUserById(news).subscribe({
      next: (event: any) => {
        this.email = event.User.email;
        this.firstName  = event.User.firstName;
        this.lastName =  event.User.lastName;
        this.address = event.User.address;
        this.city = event.User.city;
        this.postCode = event.User.postCode;
      },
      error: err => {
          this.error = err.error.error;
      },
      complete: () => {
      }
    })
  }

  showNewPasswordAction() {
    this.showNewPassword = !this.showNewPassword;
  }

  saveProfile() {
    this.isLoading = true;
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
    if(this.editMode == false) {
      this.userService.createUser(data).subscribe({
        next: (event: any) => {
          this.router.navigate(['/application/management/users-list']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = err.error;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      if(this.userEditId) {
        this.userService.updateUser(this.userEditId, data).subscribe({
          next: (event: any) => {
            this.router.navigate(['/application/management/users-list']);
          },
          error: (err) => {
            this.isLoading = false;
            this.error = err.error;
          },
          complete: () => {
            this.isLoading = false;
          },
        });
      }
    }
  }

  accountChange() {
  }

  getPages() {
    this.listOfPages = [];
    this.accountsValue = [];
    this.facebookSocialService.getCurrentApprovedFBPages().subscribe({
        next: (event: any) => {
            this.listOfPages = new Array();
            event.pages.forEach((page: any) => {
              if (page.isConnected == true) {
                  this.listOfPages.push(page);
              }
            })
        },
        error: err => {
            this.shared.createMessage('error', err.error.message);
        },
        complete: () => {

        }
    });
  }
}
