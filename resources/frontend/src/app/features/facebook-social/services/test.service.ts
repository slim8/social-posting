import { Injectable } from '@angular/core';
import { sharedConstants } from '../../../shared/sharedConstants';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class TestService {

    constructor(private http: HttpClient) { }

    public sendPost(credentials: any) : any {
        console.log(this.http.post(sharedConstants.API_ENDPOINT + '/send-post', credentials));
    }
}
