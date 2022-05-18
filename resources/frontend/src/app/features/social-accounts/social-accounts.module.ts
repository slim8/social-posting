import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialAccountsRoutingModule } from './social-accounts-routing.module';
import { SocialAccountsComponent } from './social-accounts.component';
import { AccountPagesComponent } from './components/account-pages/account-pages.component';


@NgModule({
  declarations: [
    SocialAccountsComponent,
    AccountPagesComponent
  ],
  imports: [
    CommonModule,
    SocialAccountsRoutingModule
  ]
})
export class SocialAccountsModule { }
