import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CompanyComponent } from '../features/company/company.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path:'companies',component:CompanyComponent}
    ],
  },

  // { path: '', component: MainComponent },
  // { path: 'facebook', loadChildren: () => import('./features/facebook.module').then(m => m.WelcomeModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
