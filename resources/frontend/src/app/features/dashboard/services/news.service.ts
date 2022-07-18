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

  addNews(data : any ,params : any = []) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'news',data);
  }

  getNewsById( id : number , params : any = []) {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'news/'+id,{params});
  }

  updateNews(params : any = []) {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'news',{params});
  }

}
