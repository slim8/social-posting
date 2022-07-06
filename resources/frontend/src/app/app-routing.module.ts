
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './features/auth/services/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), canActivate: [AuthGuard] },
    { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
    // { path: '', pathMatch: 'full', redirectTo: '/application' },
    // { path: '**', pathMatch: 'full', redirectTo: '/application' },
    // { path: '', component: MainComponent },
    // { path: 'facebook', loadChildren: () => import('./features/facebook.module').then(m => m.WelcomeModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }
