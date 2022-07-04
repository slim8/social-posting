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

}
