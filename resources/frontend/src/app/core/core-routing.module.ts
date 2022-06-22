import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { PremiumComponent } from './components/premium/premium.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: 'dashboard', loadChildren: () => import('../features/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'accounts', loadChildren: () => import('..//features/accounts/accounts.module').then(m => m.AccountsModule) },
            { path: 'drafts', loadChildren: () => import('../features/drafts/drafts.module').then(m => m.DraftsModule) },
            { path: 'create-post', loadChildren: () => import('../features/create-post/create-post.module').then(m => m.CreatePostModule) },
            { path: 'my-album', loadChildren: () => import('../features/my-album/my-album.module').then(m => m.MyAlbumModule) },
            { path: 'published-posts', loadChildren: () => import('../features/published-posts/published-posts.module').then(m => m.PublishedPostsModule) },

            // TODO: remove unused modules
            { path: 'premium', component: PremiumComponent },
            { path: 'facebook', loadChildren: () => import('../features/facebook-social/facebook-social.module').then(m => m.FacebookSocialModule) },
            { path: 'user', loadChildren: () => import('../features/user/user.module').then(m => m.UserModule) },
            { path: 'social-accounts', loadChildren: () => import('../features/social-accounts/social-accounts.module').then(m => m.SocialAccountsModule) },
            { path: 'management', loadChildren: () => import('../features/management/management.module').then(m => m.ManagementModule) },
            { path: 'administration', loadChildren: () => import('../features/administration/administration.module').then(m => m.AdministrationModule) },
            // { path: '**', pathMatch: 'full', redirectTo: '/home' },
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoreRoutingModule { }
