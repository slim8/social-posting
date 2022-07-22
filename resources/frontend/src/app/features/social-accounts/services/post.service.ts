import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Injectable({
    providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  posts() {
      return this.http.get(sharedConstants.API_ENDPOINT + 'posts');
  }

  getPosts(params : any = []) {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'posts', {params})
  }

  removeDrafts(params : any = []) {
      return this.http.post(sharedConstants.API_ENDPOINT + 'drafts/delete' , params);
  }

  publishDraft(id: string, params : any = []) {
    return this.http.post(sharedConstants.API_ENDPOINT + 'drafts/publish/' + id , params);
  }

}
