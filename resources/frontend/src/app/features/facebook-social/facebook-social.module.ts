import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from '../../shared/ng-zorro-antd.module';
import { IconsProviderModule } from '../../shared/icons-provider.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FacebookSocialRoutingModule } from './facebook-social-routing.module';
import { FacebookSocialComponent } from './facebook-social.component';
import { FacebookModule } from 'ngx-facebook';
import { FacebookPagesComponent } from './components/facebook-pages/facebook-pages.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import {  } from '../../shared/ng-zorro-antd.module'
import { SharedModule } from 'src/app/shared/shared.module';
import { TestUploadComponent } from './components/test-upload/test-upload.component';


@NgModule({
  declarations: [
    FacebookSocialComponent,
    FacebookPagesComponent,
    CreatePostComponent,
    TestUploadComponent
  ],
  imports: [
    NzIconModule,
    CommonModule,
    FacebookSocialRoutingModule,
    FacebookModule,
    FormsModule,
    ReactiveFormsModule,
    DemoNgZorroAntdModule,
    IconsProviderModule,
    SharedModule,
  ]
})
export class FacebookSocialModule { }
