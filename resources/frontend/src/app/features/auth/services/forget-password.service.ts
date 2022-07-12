import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(private http: HttpClient, private jwtService: JwtHelperService) { }

  public forgetPassword(email: any) {
    return this.http.post(sharedConstants.API_ENDPOINT + 'forget-password', email);
  }

  public resetPassword(credentials: any) {
    return this.http.post(sharedConstants.API_ENDPOINT + 'reset-password', credentials);
  }
}
