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

  addNewsTextMedia(data : any ,params : any = []) {
    return this.http.post(sharedConstants.API_ENDPOINT+ 'text-media-news',data);
  }

  getNewsById( id : number , params : any = []) {
    return this.http.get(sharedConstants.API_ENDPOINT+ 'news/'+id,{params});
  }

  getTextMediaNewsById(id : number){
    return this.http.get(sharedConstants.API_ENDPOINT+ 'text-media-news/'+id);
  }

  updateNews(id : string | null ,news : FormData ,params : any = []) {
    news.append('_method','PUT');
    return this.http.post(sharedConstants.API_ENDPOINT+ 'news/'+id,news);
  }

  updateNewsTextMedia(id : string | null ,textMedia : FormData ,params : any = []) {
    textMedia.append('_method','PUT');
    return this.http.post(sharedConstants.API_ENDPOINT+ 'text-media-news/'+id,textMedia);
  }

  deleteNews(id : number ) {
    return this.http.delete(sharedConstants.API_ENDPOINT+ 'news/'+id);
  }

  deleteNewsTextMedia(id : number ) {
    return this.http.delete(sharedConstants.API_ENDPOINT+ 'text-media-news/'+id);
  }

}
