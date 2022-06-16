import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './features/auth/services/auth.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/application' },
    { path: 'application', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
    { path: 'social-accounts', loadChildren: () => import('./features/social-accounts/social-accounts.module').then(m => m.SocialAccountsModule) },
    { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'not-found' },
    // { path: '', component: MainComponent },
    // { path: 'facebook', loadChildren: () => import('./features/facebook.module').then(m => m.WelcomeModule) }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
