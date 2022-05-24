import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookSocialComponent } from './facebook-social.component';
import { FacebookPagesComponent } from './components/facebook-pages/facebook-pages.component';
import { CreatePostComponent } from './components/create-post/create-post.component';

const routes: Routes = [
    { path: '', component: FacebookSocialComponent },
    { path: 'pages', component: FacebookPagesComponent },
    { path: 'create-post', component: CreatePostComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookSocialRoutingModule { }
