import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', loadChildren: () => import('./core/core.module').then(m => m.CoreModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'social-accounts', loadChildren: () => import('./features/social-accounts/social-accounts.module').then(m => m.SocialAccountsModule) },
  // { path: '', component: MainComponent },
  // { path: 'facebook', loadChildren: () => import('./features/facebook.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
