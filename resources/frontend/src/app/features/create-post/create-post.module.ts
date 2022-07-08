import { AlbumPreviewComponent } from 'src/app/Shared/Components/album-preview/album-preview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePostRoutingModule } from './create-post-routing.module';
import { CreatePostComponent } from './create-post.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FacebookModule } from 'ngx-facebook';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoNgZorroAntdModule } from 'src/app/shared/ng-zorro-antd.module';
import { IconsProviderModule } from 'src/app/shared/icons-provider.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { FacebookPreviewComponent } from 'src/app/shared/components/facebook-preview/facebook-preview.component';


@NgModule({
  declarations: [
    CreatePostComponent,
    CarouselComponent,
    FacebookPreviewComponent,
    AlbumPreviewComponent
  ],
  imports: [
    CreatePostRoutingModule,
    NzIconModule,
    CommonModule,
    FacebookModule,
    FormsModule,
    ReactiveFormsModule,
    DemoNgZorroAntdModule,
    IconsProviderModule,
    SharedModule,
  ]
})
export class CreatePostModule { }
