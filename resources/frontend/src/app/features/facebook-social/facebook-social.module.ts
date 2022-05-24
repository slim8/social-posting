import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from '../../shared/ng-zorro-antd.module';
import { IconsProviderModule } from '../../shared/icons-provider.module';
import { FacebookSocialRoutingModule } from './facebook-social-routing.module';
import { FacebookSocialComponent } from './facebook-social.component';
import { FacebookModule } from 'ngx-facebook';
import { FacebookPagesComponent } from './components/facebook-pages/facebook-pages.component';


@NgModule({
  declarations: [
    FacebookSocialComponent,
    FacebookPagesComponent
  ],
  imports: [
    NzIconModule,
    CommonModule,
    FacebookSocialRoutingModule,
    FacebookModule,
    FormsModule,
    ReactiveFormsModule,
    DemoNgZorroAntdModule,
    IconsProviderModule
  ]
})
export class FacebookSocialModule { }
