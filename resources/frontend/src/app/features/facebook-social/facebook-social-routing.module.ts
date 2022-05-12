import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacebookSocialComponent } from './facebook-social.component';

const routes: Routes = [{ path: '', component: FacebookSocialComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacebookSocialRoutingModule { }
