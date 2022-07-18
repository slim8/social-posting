import { sharedConstants } from 'src/app/shared/sharedConstants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getNewsList(params : any = []) {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'news',{params});
  }
}
