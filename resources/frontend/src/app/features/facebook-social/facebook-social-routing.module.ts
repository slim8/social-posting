import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookSocialComponent } from './facebook-social.component';
import { FacebookPagesComponent } from './facebook-pages/facebook-pages.component';

const routes: Routes = [
    { path: '', component: FacebookSocialComponent },
    { path: 'pages', component: FacebookPagesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookSocialRoutingModule { }
