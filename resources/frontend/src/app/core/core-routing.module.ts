import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'facebook', loadChildren: () => import('../features/facebook-social/facebook-social.module').then(m => m.FacebookSocialModule) },
      { path: 'user', loadChildren: () => import('../features/user/user.module').then(m => m.UserModule) },
      { path: 'social-accounts', loadChildren: () => import('../features/social-accounts/social-accounts.module').then(m => m.SocialAccountsModule) },
    ],
  },
  // { path: '', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
