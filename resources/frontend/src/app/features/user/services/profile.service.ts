import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

    getProfileDetails() {
        return this.http.get(sharedConstants.API_ENDPOINT+ 'profile' );
    }

    saveNewPassword(data : any) {
      return this.http.post(sharedConstants.API_ENDPOINT+ 'change-password',data );
    }

    saveProfile(data : any) {
      return this.http.post(sharedConstants.API_ENDPOINT+ 'profile',data );
    }
  
}
