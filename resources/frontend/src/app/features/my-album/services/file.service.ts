import { HttpClient } from '@angular/common/http';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  getImagesList(id : number) {
    return this.http.get<{files : [{url: string ,post_id: number ,type: string}]}>(sharedConstants.API_ENDPOINT+ 'files/' + id );
  }
}
