import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedConstants } from '../../../shared/sharedConstants';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private jwtService: JwtHelperService) { }

  public login(credentials: any) {
    return this.http.post(sharedConstants.API_ENDPOINT + '/login', credentials);
  }

  public checkLoggedIn() {
    return this.http.get(sharedConstants.API_ENDPOINT + '/check-logged-in');
  }

  // return true is there is a loggen in user
  public loggedIn(): boolean {
    return this.jwtService.tokenGetter() !== null && !this.jwtService.isTokenExpired();
  }

  logout() {
    localStorage.removeItem('token');
  }

}
