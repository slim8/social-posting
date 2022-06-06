import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocialAccountsComponent } from './social-accounts.component';
import { AccountPagesComponent } from './components/account-pages/account-pages.component';
import { AccountsManagementComponent } from './components/accounts-management/accounts-management.component';
import { CreatePostComponent } from '../facebook-social/components/create-post/create-post.component';
import { DraftComponent } from './components/draft/draft.component';

const routes: Routes = [
    { path: '', component: SocialAccountsComponent },
    { path: 'pages', component: AccountPagesComponent },
    { path: 'accounts-management', component: AccountsManagementComponent },
    { path: 'create-post', component: CreatePostComponent },
    { path: 'draft', component: DraftComponent },
    { path: 'pages', component: AccountPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialAccountsRoutingModule { }
