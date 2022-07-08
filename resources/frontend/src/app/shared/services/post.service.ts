import { HttpClient } from '@angular/common/http';
import { sharedConstants } from 'src/app/shared/sharedConstants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

   uploadFile(file : File) : Observable<{files : any[] , success : boolean}> {

    const formData = new FormData(); 
        
    formData.append("file", file, file.name);
    
    return this.http.post<{files : any[] , success : boolean}>(sharedConstants.API_ENDPOINT + "uploadfile" ,formData);
  }

  uploadFileB64(file : File) : Observable<{files : any[] , success : boolean}> {

    const formData = new FormData(); 
        
    formData.append("file", file, file.name);
    
    return this.http.post<{files : any[] , success : boolean}>(sharedConstants.API_ENDPOINT + "uploadBase64" ,formData);
  }

}
