import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Injectable({
    providedIn: 'root'
})
export class AccountsService {

    constructor(private http: HttpClient) { }

    getConnectedAccounts () {
        return this.http.get(sharedConstants.API_ENDPOINT+ '/get-connected-accounts');
    }

    disconnectAccountById(id : string) {
        return this.http.post(sharedConstants.API_ENDPOINT+ '/disconnect-token', {'id' : id});
    }

}
