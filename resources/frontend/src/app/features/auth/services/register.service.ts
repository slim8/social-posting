import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CompanyModel } from "../../../models/Company.model";

@Injectable({
    providedIn: 'root'
})
export class RegisterService {

    constructor(private httpClient: HttpClient) { }

    public saveResources(url: any, data: any): Observable<CompanyModel> {
        return this.httpClient.post<CompanyModel>(url, data);
    }

}