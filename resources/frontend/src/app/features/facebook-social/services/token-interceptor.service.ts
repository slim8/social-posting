import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sharedConstants } from '../../../shared/sharedConstants'

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem(sharedConstants.HTTP_TOKEN);
        

        if (token) {
            // If we have a token, we set it to the header
            req = req.clone({
                setHeaders: { Authorization: `${sharedConstants.HTTP_AUTH} ${token}` }
            });
        }

        // if (!req.headers.has(sharedConstants.HTTP_APPLICATION)) {
        //     if (req.url.includes("send-post")) {
        //         console.log(sharedConstants.HTTP_MULTI_DATAFORM);
        //         req = req.clone({
        //             headers: req.headers.set(sharedConstants.HTTP_APPLICATION, sharedConstants.HTTP_MULTI_DATAFORM)
        //         });
        //     } else {
        //         console.log(sharedConstants.HTTP_APP_JSON);
        //         req = req.clone({
        //             headers: req.headers.set(sharedConstants.HTTP_APPLICATION, sharedConstants.HTTP_APP_JSON)
        //         });
        //     }
        // }

        console.log(req.headers);
        return next.handle(req);
    }
}
