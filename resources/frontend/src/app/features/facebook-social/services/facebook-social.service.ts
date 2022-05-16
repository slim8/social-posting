import { HttpClient } from '@angular/common/http';
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

  getCurrentUser() {}
  /**
   * Login with additional permissions/options
   * @returns connected user id and access token
   */
  loginWithFacebook() {
    const loginOptions: LoginOptions = {
      enable_profile_selector: true,
      return_scopes: true,
      scope:
        'public_profile,publish_to_groups,email,pages_show_list,pages_manage_posts,pages_read_engagement,pages_read_user_content,user_posts',
    };

    return this.fb.login(loginOptions);
  }

  getLoginStatus() {
    const url = `https://graph.facebook.com/me`;
    return this.http.get(url);
  }

  /**
   * @param userId :number
   * @param accessToken :string
   * @returns a list of pages you have a role and information about each Page such as the Page category,
   * the specific permissions you have on each Page, and the Page access token
   */
  getCurrentFBPages(user: any) {
    const url = `https://graph.facebook.com/1703848376633794/accounts?access_token=EAAH6ob18mfkBADyEMJLVDZBnCCbcQs838U4Fo9FeqcXgMcOq8ZAWZANTphTZCiNE2y7qkPiAfUFGHrg1DjTC5Ntbj4PclMsu7VMJYJNBNe90fxBLdKhANVIafFK8jbaE6jSdMiEErbM2d7qdxYbUIFdtu0dVDKegFfBc6aScZAebZCssHAiNZCY0E8AkFqvOpbroy4ZCohcgV2MKYgUSwtpdbfPPlV5eK9kZD`;

    return this.http.get(url);
  }

  /**
   * Post simple text on demanded page
   * @param page
   * @returns
   */
  postTextToPage(page: any) {
    const payload = {
      message: 'Hello, Message Here :)',
      access_token: page.access_token,
    };
    return this.fb.api(`/${page.id}/feed`, 'post', payload);
  }

  /**
   * Post public image using it's URL on demanded page
   * @param page
   * @returns
   */
  postPublicImageToPage(page: any) {
    const payload = {
      message: 'Hello, Message Here :)',
      access_token: page.access_token,
      url: 'https://images.pexels.com/photos/5044497/pexels-photo-5044497.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    };
    return this.fb.api(`/${page.id}/photos`, 'post', payload);
  }

  /**
   * Post uploaded image on demanded page
   * @param page
   * @param payload
   * @returns
   */
  postSourceImageToPage(page: any, payload: any) {
    const url = `https://graph.facebook.com/${page.id}/photos?access_token=${page.access_token}`;
    return this.http.post(url, payload);
  }

  /**
   * This is a convenience method for the sake of this example project.
   * Do not use this in production, it's better to handle errors separately.
   * @param error
   */
  private handleError(error: any) {
    console.error('Error processing action', error);
  }
}
