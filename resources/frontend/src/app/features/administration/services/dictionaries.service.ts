import { sharedConstants } from './../../../shared/sharedConstants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DictionariesService {

  constructor(private http: HttpClient) {}

  getDictionariesList() {
    return this.http.get(sharedConstants.API_ENDPOINT+ '/dictionary' );
  }

  addDictionary(data : any) {
    return this.http.post(sharedConstants.API_ENDPOINT+ '/dictionary' ,data );
  }

  updateDictionary(data : any) {
    return this.http.post(sharedConstants.API_ENDPOINT+ '/dictionary/'+ data.get('id') , data);
  }

  removeDictionary(id : any) {
    return this.http.delete(sharedConstants.API_ENDPOINT+ '/dictionary/'+id);
  }

}
