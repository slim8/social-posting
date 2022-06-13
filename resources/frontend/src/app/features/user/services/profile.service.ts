import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

    getProfileDetails(id: any) {
        return this.http.get(sharedConstants.API_ENDPOINT+ '/profile/' + id );
    }

    saveNewPassword(data : any) {
      return this.http.post(sharedConstants.API_ENDPOINT+ '/change-password',data );
    }
  
}
