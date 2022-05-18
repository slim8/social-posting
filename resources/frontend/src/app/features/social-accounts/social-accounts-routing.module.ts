import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialAccountsComponent } from './social-accounts.component';
import { AccountPagesComponent } from '../social-accounts/account-pages/account-pages.component';

const routes: Routes = [
    { path: '', component: SocialAccountsComponent },
    { path: 'pages', component: AccountPagesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialAccountsRoutingModule { }
