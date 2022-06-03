import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialAccountsRoutingModule } from './social-accounts-routing.module';
import { SocialAccountsComponent } from './social-accounts.component';
import { AccountPagesComponent } from './components/account-pages/account-pages.component';
import { AccountsManagementComponent } from './components/accounts-management/accounts-management.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SocialAccountsComponent,
    AccountPagesComponent,
    AccountsManagementComponent
  ],
  imports: [
    CommonModule,
    SocialAccountsRoutingModule,
    SharedModule
  ]
})
export class SocialAccountsModule { }
