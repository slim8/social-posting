import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    AuthResponse,
    FacebookService,
    InitParams,
    LoginOptions,
    LoginResponse,
    UIParams,
    UIResponse,
} from 'ngx-facebook';
import { sharedConstants } from 'src/app/shared/sharedConstants';

@Injectable({
    providedIn: 'root',
})
export class FacebookSocialService {
    private APP_ID = '557047552449017';
    private REDIRECT_URL = 'http://localhost:4200';

    /**
     * initialize facebook ressources
     * @param fb
     * @param http
     */
    constructor(private fb: FacebookService, private http: HttpClient) {
        const initParams: InitParams = {
            appId: this.APP_ID,
            xfbml: true,
            version: 'v13.0',
        };

        fb.init(initParams);
    }

    login() {
        window.location.href = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${this.APP_ID}&redirect_uri=${this.REDIRECT_URL}`;
    }

    getCurrentUser() { }
    /**
     * Login with additional permissions/options
     * @returns connected user id and access token
     */
    loginWithFacebook() {
        const loginOptions: LoginOptions = {
            enable_profile_selector: true,
            return_scopes: true,
            scope:
                'public_profile,publish_to_groups,email,pages_show_list,pages_manage_posts,pages_read_engagement,pages_read_user_content,user_posts,instagram_content_publish,instagram_basic,instagram_manage_insights,instagram_manage_comments,instagram_manage_messages,pages_manage_instant_articles,pages_manage_metadata',
        };

        return this.fb.login(loginOptions);
    }

    getLoginStatus() {
        const url = `https://graph.facebook.com/me`;
        return this.http.get(url);
    }

    getCurrentApprovedFBPages() {
        const url = sharedConstants.API_ENDPOINT + 'accounts';

        return this.http.get(url);
    }


    /**
     * This is a convenience method for the sake of this example project.
     * Do not use this in production, it's better to handle errors separately.
     * @param error
     */
    private handleError(error: any) {
        console.error('Error processing action', error);
    }


    manageFacebookPages(url: any, data: any) {
        return this.http.post(url, data);
    }

    postToSocialMedia(formData: FormData) {
        return this.http.post(sharedConstants.API_ENDPOINT + 'send-post', formData, {
            reportProgress: true,
            observe: 'events'
        })
    }

    getPostsBypageId(pageId: any) {
        return this.http.get(sharedConstants.API_ENDPOINT + "accounts/" + pageId + "/posts");
    }

}
