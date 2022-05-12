import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookSocialRoutingModule } from './facebook-social-routing.module';
import { FacebookSocialComponent } from './facebook-social.component';
import { FacebookModule } from 'ngx-facebook';


@NgModule({
  declarations: [
    FacebookSocialComponent
  ],
  imports: [
    CommonModule,
    FacebookSocialRoutingModule,
    FacebookModule,
  ]
})
export class FacebookSocialModule { }
