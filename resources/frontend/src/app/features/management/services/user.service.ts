import { sharedConstants } from './../../../shared/sharedConstants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsersList() {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'managment/users' );
  }

  getPagesList() {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'accounts' );
  }

  createUser(data : any) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'register-user',data );
  }

  updateUser(id: string, data : any= []) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'managment/users/update/'+id ,data );
  }

  addPermission(data : any) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'managment/permissions/add',data );
  }

  removePermission(data : any) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'managment/permissions/remove',data );
  }

  deleteUser(id:string, data: any = []) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'managment/users/delete/'+id, data );
  }

  getUserById( id : number , params : any = []) {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'managment/users/'+id,{params});
  }
}
