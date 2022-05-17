import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedConstants } from '../../../shared/sharedConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(credentials:any) {
      return this.http.post(sharedConstants.API_ENDPOINT+'/login', credentials );
  }
}
