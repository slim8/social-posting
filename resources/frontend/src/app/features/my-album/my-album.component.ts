import { JwtHelperService } from '@auth0/angular-jwt';
import { FileService } from './services/file.service';
import { NzIconService } from 'ng-zorro-antd/icon';
import { Component, OnInit } from '@angular/core';

const calenderIcon = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 7.5V5.25C15 4.42157 14.3284 3.75 13.5 3.75H4.5C3.67157 3.75 3 4.42157 3 5.25V7.5M15 7.5V14.25C15 15.0784 14.3284 15.75 13.5 15.75H4.5C3.67157 15.75 3 15.0784 3 14.25V7.5M15 7.5H3M6 2.25V5.25M12 2.25V5.25" stroke="black" stroke-width="1.5" stroke-linecap="round"/><rect x="4.5" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="7.875" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/><rect x="11.25" y="9" width="2.25" height="2.25" rx="0.375" fill="black"/></svg>';
const costumEditIcon = '<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3.71809H4.5C3.67157 3.71809 3 4.38966 3 5.21809V14.2181C3 15.0465 3.67157 15.7181 4.5 15.7181H13.5C14.3284 15.7181 15 15.0465 15 14.2181V9.71809M13.8107 7.02874L14.625 6.21442C15.2108 5.62863 15.2108 4.67889 14.625 4.09311C14.0392 3.50732 13.0894 3.50732 12.5036 4.09312L11.6893 4.90742M13.8107 7.02874L9.28346 11.556C9.07406 11.7654 8.80736 11.9081 8.51697 11.9662L6.31067 12.4075L6.75193 10.2012C6.81001 9.91079 6.95274 9.64409 7.16213 9.4347L11.6893 4.90742M13.8107 7.02874L11.6893 4.90742" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const arrowIcon = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.08398 1.24992L5.41313 4.92077C5.18532 5.14858 4.81598 5.14858 4.58817 4.92077L0.917318 1.24992" stroke="black" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round"/></svg>'
@Component({
    selector: 'app-my-album',
    templateUrl: './my-album.component.html',
    styleUrls: ['./my-album.component.scss']
})
export class MyAlbumComponent implements OnInit {
    displayLoginModal: boolean = false;
    loggedIn: boolean = false;
    isLoading: boolean = false;
    isLoadingButton: boolean = false;
    images = [{url: '' ,id: 0 ,type: '' , thumbnailLink : ''}];
    credentials = {
      email: '',
      password: '',
    };

    constructor(
        private iconService: NzIconService , private fileService: FileService ,private jwtService: JwtHelperService
    ) {
        this.iconService.addIconLiteral('ng-zorro:calender', calenderIcon);
        this.iconService.addIconLiteral('ng-zorro:costum-edit', costumEditIcon);
        this.iconService.addIconLiteral('ng-zorro:customArrow', arrowIcon);

    }

    ngOnInit(): void {
        this.isLoading = true;
        this.fileService.getImagesList(this.jwtService.decodeToken().data.id).subscribe({
            next : (event) => {
                this.images = event.files;
                this.isLoading = false;
            },
            error : (error) => {
                console.log(error);
            }
        })
    }

    showLoginModal() {
      this.displayLoginModal = true;
    }

    closeModal() {
      this.displayLoginModal = false;
    }

    logOut() {

    }

    login() {
      this.isLoadingButton = true;
    }

}
