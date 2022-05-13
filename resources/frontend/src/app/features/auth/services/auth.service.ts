import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(credentials:any) {
      return this.http.post('https://reqres.in/api/login', credentials );
  }
}
